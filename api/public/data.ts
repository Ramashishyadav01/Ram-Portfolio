import type { IncomingMessage, ServerResponse } from 'http';
import { connectToDatabase } from '../_lib/db.js';
import { setCorsHeaders, handleOptions } from '../_lib/auth.js';

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const db = await connectToDatabase();

    const [about, skills, projects, contact, resume, experience] = await Promise.all([
      db.collection('about').findOne({}),
      db.collection('skills').find({}).sort({ category: 1, order: 1 }).toArray(),
      db
        .collection('projects')
        .find({ status: 'published' })
        .sort({ order: 1 })
        .toArray(),
      db.collection('contact').findOne({}),
      db
        .collection('resume')
        .findOne(
          { isActive: true },
          { projection: { url: 1, originalName: 1, uploadedAt: 1 } }
        ),
      db.collection('experience').find({}).sort({ order: 1 }).toArray(),
    ]);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    });
    res.end(
      JSON.stringify({
        about: about ?? null,
        skills: skills.length > 0 ? skills : null,
        experience: experience.length > 0 ? experience : null,
        projects: projects.length > 0 ? projects : null,
        contact: contact ?? null,
        resume: resume ?? null,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }
}
