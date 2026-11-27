import jwt from 'jsonwebtoken';
import type { IncomingMessage, ServerResponse } from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-me';

export interface JwtPayload {
  adminId: string;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getTokenFromRequest(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

export function requireAuth(
  req: IncomingMessage,
  res: ServerResponse
): JwtPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Authentication required' }));
    return null;
  }
  try {
    return verifyToken(token);
  } catch {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid or expired token' }));
    return null;
  }
}

export function setCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleOptions(req: IncomingMessage, res: ServerResponse): boolean {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

export async function parseBody<T = Record<string, unknown>>(
  req: IncomingMessage
): Promise<T> {
  const reqWithBody = req as IncomingMessage & { body?: unknown };
  if (reqWithBody.body && typeof reqWithBody.body === 'object') {
    return reqWithBody.body as T;
  }
  const buffers: Uint8Array[] = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const raw = Buffer.concat(buffers).toString('utf-8').trim();
  const parsed: unknown = raw ? JSON.parse(raw) : {};
  return parsed as T;
}
