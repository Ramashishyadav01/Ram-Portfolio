import type { IncomingMessage, ServerResponse } from 'http';
import { connectToDatabase } from '../_lib/db.js';
import {
  requireAuth,
  setCorsHeaders,
  handleOptions,
  parseBody,
} from '../_lib/auth.js';

interface ContactBody {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  additionalLinks?: Array<{ label: string; url: string }>;
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const db = await connectToDatabase();
  const collection = db.collection('contact');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const contact = await collection.findOne({});

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: contact }));
      return;
    }

    if (method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseBody<ContactBody>(req);

      const updateFields: Record<string, any> = {};
      if (body.email !== undefined) updateFields.email = body.email;
      if (body.phone !== undefined) updateFields.phone = body.phone;
      if (body.location !== undefined) updateFields.location = body.location;
      if (body.linkedin !== undefined) updateFields.linkedin = body.linkedin;
      if (body.github !== undefined) updateFields.github = body.github;
      if (body.portfolio !== undefined) updateFields.portfolio = body.portfolio;
      if (body.additionalLinks !== undefined)
        updateFields.additionalLinks = body.additionalLinks;
      updateFields.updatedAt = new Date();

      const result = await collection.updateOne(
        {},
        { $set: updateFields },
        { upsert: true }
      );

      const updated = await collection.findOne({});

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          data: updated,
          upserted: result.upsertedCount > 0,
        })
      );
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  } catch (error: any) {
    console.error('Contact API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
