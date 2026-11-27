import type { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import formidable from 'formidable';
import { connectToDatabase } from '../_lib/db.js';
import { requireAuth, setCorsHeaders, handleOptions } from '../_lib/auth.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../_lib/cloudinary.js';

export const config = { api: { bodyParser: false } };

const ALLOWED_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(res);

  const user = requireAuth(req, res);
  if (!user) return;

  const db = await connectToDatabase();
  const collection = db.collection('resume');
  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const allResumes = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
      const activeResume = allResumes.find((r) => r.isActive) || null;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          resumes: allResumes,
          resume: activeResume,
          data: activeResume,
        })
      );
      return;
    }

    if (method === 'POST') {
      const form = formidable({ maxFileSize: MAX_FILE_SIZE });
      const [, files] = await form.parse(req);

      const file = files.resume?.[0];
      if (!file) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'No resume file provided' }));
        return;
      }

      if (!ALLOWED_MIMETYPES.includes(file.mimetype || '')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Invalid file type. Only PDF, DOC, and DOCX are allowed',
          })
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'File size exceeds 5MB limit' })
        );
        return;
      }

      const uploadResult = await uploadToCloudinary(file.filepath, {
        folder: 'portfolio/resumes',
        resourceType: 'raw',
      });

      // Deactivate all existing resumes
      await collection.updateMany({}, { $set: { isActive: false } });

      const resumeDoc = {
        filename: uploadResult.public_id.split('/').pop() || file.newFilename,
        originalName: file.originalFilename || 'resume',
        url: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        fileSize: file.size,
        fileType: file.mimetype,
        uploadedAt: new Date(),
        isActive: true,
      };

      const result = await collection.insertOne(resumeDoc);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          data: { ...resumeDoc, _id: result.insertedId },
        })
      );
      return;
    }

    if (method === 'DELETE') {
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const id = url.searchParams.get('id');

      if (!id || !ObjectId.isValid(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ success: false, error: 'Valid resume ID is required' })
        );
        return;
      }

      const resume = await collection.findOne({ _id: new ObjectId(id) });
      if (!resume) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Resume not found' }));
        return;
      }

      // Delete from Cloudinary
      if (resume.cloudinaryId) {
        await deleteFromCloudinary(resume.cloudinaryId, 'raw');
      }

      const wasActive = resume.isActive;
      await collection.deleteOne({ _id: new ObjectId(id) });

      // If deleted resume was active, set most recent remaining as active
      if (wasActive) {
        const mostRecent = await collection.findOne(
          {},
          { sort: { uploadedAt: -1 } }
        );
        if (mostRecent) {
          await collection.updateOne(
            { _id: mostRecent._id },
            { $set: { isActive: true } }
          );
        }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Resume deleted' }));
      return;
    }

    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  } catch (error: any) {
    console.error('Resume API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      })
    );
  }
}
