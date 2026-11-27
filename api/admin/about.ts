import type { IncomingMessage, ServerResponse } from 'http';
import { connectToDatabase } from '../_lib/db.js';
import {
  requireAuth,
  setCorsHeaders,
  handleOptions,
  parseBody,
} from '../_lib/auth.js';

interface AboutBody {
  title?: string;
  subtitle?: string;
  description?: string[];
  highlights?: Array<{ icon: string; title: string; desc: string }>;
  stats?: Array<{ value: string; label: string }>;
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const db = await connectToDatabase();
  const collection = db.collection('about');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const about = await collection.findOne({});

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: about }));
      return;
    }

    if (method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseBody<AboutBody>(req);

      const updateFields: Record<string, any> = {};
      if (body.title !== undefined) updateFields.title = body.title;
      if (body.subtitle !== undefined) updateFields.subtitle = body.subtitle;
      if (body.description !== undefined) updateFields.description = body.description;
      if (body.highlights !== undefined) updateFields.highlights = body.highlights;
      if (body.stats !== undefined) updateFields.stats = body.stats;
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
    console.error('About API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
