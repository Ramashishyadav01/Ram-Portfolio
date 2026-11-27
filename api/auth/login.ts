import type { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../_lib/db.js';
import { signToken, setCorsHeaders, handleOptions, parseBody } from '../_lib/auth.js';

interface LoginBody {
  email: string;
  password: string;
}

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  setCorsHeaders(res);

  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  try {
    const { email, password } = await parseBody<LoginBody>(req);

    if (!email || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Email and password are required' })
      );
      return;
    }

    const db = await connectToDatabase();
    const admin = await db.collection('admins').findOne({ email });

    if (!admin) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Invalid credentials' })
      );
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Invalid credentials' })
      );
      return;
    }

    const token = signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        token,
        admin: {
          name: admin.name,
          email: admin.email,
        },
      })
    );
  } catch (error: any) {
    console.error('Login error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ success: false, error: 'Internal server error' })
    );
  }
}
