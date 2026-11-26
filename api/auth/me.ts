import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { requireAuth, setCorsHeaders, handleOptions } from '../lib/auth';
import { connectToDatabase } from '../lib/db';

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  setCorsHeaders(res);

  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  try {
    const payload = requireAuth(req, res);

    if (!payload) return;

    const db = await connectToDatabase();
    const admin = await db
      .collection('admins')
      .findOne({ _id: new ObjectId(payload.adminId) });

    if (!admin) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Admin not found' })
      );
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        admin: {
          name: admin.name,
          email: admin.email,
        },
      })
    );
  } catch (error: any) {
    console.error('Auth me error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ success: false, error: 'Internal server error' })
    );
  }
}
