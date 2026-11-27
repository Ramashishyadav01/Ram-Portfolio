import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { connectToDatabase } from '../_lib/db.js';
import { requireAuth, setCorsHeaders, handleOptions } from '../_lib/auth.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../_lib/cloudinary.js';

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const user = requireAuth(req, res);
  if (!user) return;

  const db = await connectToDatabase();
  const collection = db.collection('projects');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const projects = await collection.find({}).sort({ order: 1 }).toArray();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: projects }));
      return;
    }

    if (method === 'POST') {
      const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
      const [fields, files] = await form.parse(req);

      const title = fields.title?.[0];
      if (!title) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Title is required' })
        );
        return;
      }

      let description: string[] = [];
      try {
        description = JSON.parse(fields.description?.[0] || '[]');
      } catch {
        description = fields.description || [];
      }

      let tech: string[] = [];
      try {
        tech = JSON.parse(fields.tech?.[0] || '[]');
      } catch {
        tech = fields.tech || [];
      }

      const github = fields.github?.[0] || '';
      const demo = fields.demo?.[0] || '';
      const status = fields.status?.[0] || 'draft';
      let order = parseInt(fields.order?.[0] || '', 10);

      if (isNaN(order)) {
        const lastProject = await collection.findOne(
          {},
          { sort: { order: -1 } }
        );
        order = lastProject ? (lastProject.order as number) + 1 : 0;
      }

      let image = '';
      let cloudinaryImageId = '';

      const imageFile = files.image?.[0];
      if (imageFile) {
        const uploadResult = await uploadToCloudinary(imageFile.filepath, {
          folder: 'portfolio/projects',
          resourceType: 'image',
        });
        image = uploadResult.secure_url;
        cloudinaryImageId = uploadResult.public_id;
      }

      const projectDoc = {
        title,
        description,
        tech,
        image,
        cloudinaryImageId,
        github,
        demo,
        status,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(projectDoc);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          data: { ...projectDoc, _id: result.insertedId },
        })
      );
      return;
    }

    if (method === 'PUT') {
      const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
      const [fields, files] = await form.parse(req);

      const id = fields.id?.[0];
      if (!id || !ObjectId.isValid(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Valid project ID is required',
          })
        );
        return;
      }

      const existing = await collection.findOne({ _id: new ObjectId(id) });
      if (!existing) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Project not found' })
        );
        return;
      }

      const updateFields: Record<string, any> = {};

      if (fields.title?.[0] !== undefined) updateFields.title = fields.title[0];

      if (fields.description?.[0] !== undefined) {
        try {
          updateFields.description = JSON.parse(fields.description[0]);
        } catch {
          updateFields.description = fields.description;
        }
      }

      if (fields.tech?.[0] !== undefined) {
        try {
          updateFields.tech = JSON.parse(fields.tech[0]);
        } catch {
          updateFields.tech = fields.tech;
        }
      }

      if (fields.github?.[0] !== undefined) updateFields.github = fields.github[0];
      if (fields.demo?.[0] !== undefined) updateFields.demo = fields.demo[0];
      if (fields.status?.[0] !== undefined) updateFields.status = fields.status[0];

      if (fields.order?.[0] !== undefined) {
        const parsedOrder = parseInt(fields.order[0], 10);
        if (!isNaN(parsedOrder)) updateFields.order = parsedOrder;
      }

      // Handle new image upload
      const imageFile = files.image?.[0];
      if (imageFile) {
        // Delete old image from Cloudinary if it exists
        if (existing.cloudinaryImageId) {
          await deleteFromCloudinary(existing.cloudinaryImageId, 'image');
        }

        const uploadResult = await uploadToCloudinary(imageFile.filepath, {
          folder: 'portfolio/projects',
          resourceType: 'image',
        });
        updateFields.image = uploadResult.secure_url;
        updateFields.cloudinaryImageId = uploadResult.public_id;
      }

      updateFields.updatedAt = new Date();

      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      const updated = await collection.findOne({ _id: new ObjectId(id) });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: updated }));
      return;
    }

    if (method === 'DELETE') {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const id = url.searchParams.get('id');

      if (!id || !ObjectId.isValid(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Valid project ID is required',
          })
        );
        return;
      }

      const project = await collection.findOne({ _id: new ObjectId(id) });
      if (!project) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Project not found' })
        );
        return;
      }

      // Delete image from Cloudinary
      if (project.cloudinaryImageId) {
        await deleteFromCloudinary(project.cloudinaryImageId, 'image');
      }

      await collection.deleteOne({ _id: new ObjectId(id) });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Project deleted' }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  } catch (error: any) {
    console.error('Projects API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
