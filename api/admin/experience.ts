import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/db.js';
import {
  requireAuth,
  setCorsHeaders,
  handleOptions,
  parseBody,
} from '../lib/auth.js';

interface ExperienceBody {
  id?: string;
  role?: string;
  company?: string;
  location?: string;
  period?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  order?: number;
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const user = requireAuth(req, res);
  if (!user) return;

  const db = await connectToDatabase();
  const collection = db.collection('experience');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const experiences = await collection
        .find({})
        .sort({ order: 1 })
        .toArray();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: experiences }));
      return;
    }

    if (method === 'POST') {
      const body = await parseBody<ExperienceBody>(req);

      if (!body.role || !body.company) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Role and company are required',
          })
        );
        return;
      }

      let order = body.order;
      if (order === undefined || order === null) {
        const lastExp = await collection.findOne(
          {},
          { sort: { order: -1 } }
        );
        order = lastExp ? (lastExp.order as number) + 1 : 0;
      }

      const expDoc = {
        role: body.role,
        company: body.company,
        location: body.location || '',
        period: body.period || '',
        description: body.description || '',
        achievements: Array.isArray(body.achievements) ? body.achievements : [],
        skills: Array.isArray(body.skills) ? body.skills : [],
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(expDoc);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          data: { ...expDoc, _id: result.insertedId },
        })
      );
      return;
    }

    if (method === 'PUT') {
      const body = await parseBody<ExperienceBody>(req);

      if (!body.id || !ObjectId.isValid(body.id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Valid experience ID is required' })
        );
        return;
      }

      const updateFields: Record<string, any> = {};
      if (body.role !== undefined) updateFields.role = body.role;
      if (body.company !== undefined) updateFields.company = body.company;
      if (body.location !== undefined) updateFields.location = body.location;
      if (body.period !== undefined) updateFields.period = body.period;
      if (body.description !== undefined) updateFields.description = body.description;
      if (body.achievements !== undefined) updateFields.achievements = body.achievements;
      if (body.skills !== undefined) updateFields.skills = body.skills;
      if (body.order !== undefined) updateFields.order = body.order;
      updateFields.updatedAt = new Date();

      if (Object.keys(updateFields).length <= 1) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'No fields to update' })
        );
        return;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(body.id) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Experience entry not found' }));
        return;
      }

      const updated = await collection.findOne({ _id: new ObjectId(body.id) });

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
          JSON.stringify({ success: false, error: 'Valid experience ID is required' })
        );
        return;
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Experience entry not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Experience deleted' }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  } catch (error: any) {
    console.error('Experience API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
