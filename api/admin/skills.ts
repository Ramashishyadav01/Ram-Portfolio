import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import {
  requireAuth,
  setCorsHeaders,
  handleOptions,
  parseBody,
} from '../_lib/auth.js';

interface SkillBody {
  id?: string;
  category?: string;
  name?: string;
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
  const collection = db.collection('skills');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const skills = await collection
        .find({})
        .sort({ category: 1, order: 1 })
        .toArray();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: skills }));
      return;
    }

    if (method === 'POST') {
      const body = await parseBody<SkillBody>(req);

      if (!body.category || !body.name) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Category and name are required',
          })
        );
        return;
      }

      let order = body.order;
      if (order === undefined || order === null) {
        const lastSkill = await collection.findOne(
          { category: body.category },
          { sort: { order: -1 } }
        );
        order = lastSkill ? (lastSkill.order as number) + 1 : 0;
      }

      const skillDoc = {
        category: body.category,
        name: body.name,
        order,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(skillDoc);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          data: { ...skillDoc, _id: result.insertedId },
        })
      );
      return;
    }

    if (method === 'PUT') {
      const body = await parseBody<SkillBody>(req);

      if (!body.id || !ObjectId.isValid(body.id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Valid skill ID is required' })
        );
        return;
      }

      const updateFields: Record<string, any> = {};
      if (body.category !== undefined) updateFields.category = body.category;
      if (body.name !== undefined) updateFields.name = body.name;
      if (body.order !== undefined) updateFields.order = body.order;

      if (Object.keys(updateFields).length === 0) {
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
        res.end(JSON.stringify({ success: false, error: 'Skill not found' }));
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
          JSON.stringify({ success: false, error: 'Valid skill ID is required' })
        );
        return;
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Skill not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Skill deleted' }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  } catch (error: any) {
    console.error('Skills API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
