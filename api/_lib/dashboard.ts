import type { IncomingMessage, ServerResponse } from 'http';
import { connectToDatabase } from './db.js';
import { requireAuth, setCorsHeaders, handleOptions } from './auth.js';

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const user = requireAuth(req, res);
  if (!user) return;

  const method = req.method?.toUpperCase();

  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  try {
    const db = await connectToDatabase();

    const [totalProjects, totalSkills, totalExperiences, activeResumeCount, about, contact, recentProjects] =
      await Promise.all([
        db.collection('projects').countDocuments(),
        db.collection('skills').countDocuments(),
        db.collection('experience').countDocuments(),
        db.collection('resume').countDocuments({ isActive: true }),
        db.collection('about').findOne({}),
        db.collection('contact').findOne({}),
        db
          .collection('projects')
          .find({})
          .sort({ createdAt: -1 })
          .limit(3)
          .toArray(),
      ]);

    const hasResume = activeResumeCount > 0;

    // Calculate profile completion (each section = 16.6% or rounded)
    let profileCompletion = 0;
    if (about && (about.title || about.description)) profileCompletion += 15;
    if (totalSkills > 0) profileCompletion += 20;
    if (totalExperiences > 0) profileCompletion += 20;
    if (hasResume) profileCompletion += 15;
    if (totalProjects > 0) profileCompletion += 20;
    if (contact && (contact.email || contact.phone)) profileCompletion += 10;
    if (profileCompletion > 100) profileCompletion = 100;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        data: {
          totalProjects,
          totalSkills,
          totalExperiences,
          hasResume,
          resumeUploaded: hasResume,
          profileCompletion,
          recentProjects,
        },
      })
    );
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
