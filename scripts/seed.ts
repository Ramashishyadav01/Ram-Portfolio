import type { IncomingMessage, ServerResponse } from 'http';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../api/_lib/db.js';
import { setCorsHeaders, handleOptions, parseBody } from '../api/_lib/auth.js';

interface SeedBody {
  email: string;
  password: string;
  name: string;
  setupKey: string;
}

const defaultAbout = {
  title: 'Results-Driven Full Stack|MERN Stack Developer',
  subtitle:
    'Full Stack Developer | MERN Stack | React.js | Node.js | REST APIs',
  description: [
    'Results-driven Full Stack Developer with hands-on expertise in the MERN stack, specializing in building responsive, scalable web applications. Proficient in React.js, Node.js, Express.js, and MongoDB, with a strong foundation in RESTful API design, state management, and modern JavaScript (ES6+).',
    'Passionate about writing clean, maintainable code and delivering seamless user experiences. Adept at collaborating in Agile environments, solving complex problems, and continuously learning emerging technologies to drive innovation.',
  ],
  highlights: [
    {
      icon: 'GraduationCap',
      title: 'Academic Foundation',
      description:
        'B.E. in Computer Science & Engineering providing strong theoretical and practical grounding in software development.',
    },
    {
      icon: 'Code2',
      title: 'Full Stack Specialisation',
      description:
        'Deep expertise in the MERN stack — MongoDB, Express.js, React.js, and Node.js — building end-to-end web applications.',
    },
    {
      icon: 'Lightbulb',
      title: 'Engineering Principles',
      description:
        'Committed to clean architecture, reusable components, and scalable design patterns across frontend and backend.',
    },
  ],
  stats: [
    { value: 'B.E. Computer Science', label: 'Education' },
    { value: 'MERN Full Stack Expert', label: 'Specialisation' },
  ],
  updatedAt: new Date(),
};

const defaultContact = {
  email: 'yadavramashish42449@gmail.com',
  phone: '+91-7860470816',
  location: 'Noida, Uttar Pradesh, India',
  linkedin: 'https://www.linkedin.com/in/ramashish-yadav',
  github: 'https://github.com/ramashish-yadav',
  portfolio: '',
  additionalLinks: [],
  updatedAt: new Date(),
};

const defaultSkills = [
  // Languages
  { category: 'Languages', name: 'JavaScript ES6+', order: 0, createdAt: new Date() },
  { category: 'Languages', name: 'TypeScript', order: 1, createdAt: new Date() },
  { category: 'Languages', name: 'Java', order: 2, createdAt: new Date() },

  // Frontend
  { category: 'Frontend', name: 'React.js', order: 0, createdAt: new Date() },
  { category: 'Frontend', name: 'Next.js', order: 1, createdAt: new Date() },
  { category: 'Frontend', name: 'Tailwind CSS', order: 2, createdAt: new Date() },
  { category: 'Frontend', name: 'HTML5', order: 3, createdAt: new Date() },
  { category: 'Frontend', name: 'CSS3', order: 4, createdAt: new Date() },
  { category: 'Frontend', name: 'Context API', order: 5, createdAt: new Date() },
  { category: 'Frontend', name: 'Redux', order: 6, createdAt: new Date() },

  // Backend
  { category: 'Backend', name: 'Node.js', order: 0, createdAt: new Date() },
  { category: 'Backend', name: 'Express.js', order: 1, createdAt: new Date() },
  { category: 'Backend', name: 'REST API design', order: 2, createdAt: new Date() },
  { category: 'Backend', name: 'JWT', order: 3, createdAt: new Date() },
  { category: 'Backend', name: 'Socket.io WebSockets', order: 4, createdAt: new Date() },
  { category: 'Backend', name: 'MVC architecture', order: 5, createdAt: new Date() },

  // Databases
  { category: 'Databases', name: 'MongoDB Mongoose ODM', order: 0, createdAt: new Date() },
  { category: 'Databases', name: 'MySQL', order: 1, createdAt: new Date() },
  { category: 'Databases', name: 'Query Optimization', order: 2, createdAt: new Date() },
  { category: 'Databases', name: 'Indexing', order: 3, createdAt: new Date() },

  // Tools & DevOps
  { category: 'Tools & DevOps', name: 'Postman', order: 0, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'Jest', order: 1, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'Git', order: 2, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'GitHub', order: 3, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'VS Code', order: 4, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'npm', order: 5, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'Docker', order: 6, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'AWS', order: 7, createdAt: new Date() },
  { category: 'Tools & DevOps', name: 'CI/CD Pipeline', order: 8, createdAt: new Date() },

  // Methodologies
  { category: 'Methodologies', name: 'Agile/Scrum', order: 0, createdAt: new Date() },
  { category: 'Methodologies', name: 'SDLC', order: 1, createdAt: new Date() },
  { category: 'Methodologies', name: 'RBAC', order: 2, createdAt: new Date() },
  { category: 'Methodologies', name: 'Input Sanitization', order: 3, createdAt: new Date() },
];

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
    const { email, password, name, setupKey } = await parseBody<SeedBody>(req);

    if (!email || !password || !name || !setupKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: 'All fields (email, password, name, setupKey) are required',
        })
      );
      return;
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Invalid setup key' })
      );
      return;
    }

    const db = await connectToDatabase();

    const existingAdmin = await db.collection('admins').findOne({});

    if (existingAdmin) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ success: false, error: 'Admin already exists' })
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    // Seed default about data if collection is empty
    const aboutCount = await db.collection('about').countDocuments();
    if (aboutCount === 0) {
      await db.collection('about').insertOne(defaultAbout);
    }

    // Seed default contact data if collection is empty
    const contactCount = await db.collection('contact').countDocuments();
    if (contactCount === 0) {
      await db.collection('contact').insertOne(defaultContact);
    }

    // Seed default skills data if collection is empty
    const skillsCount = await db.collection('skills').countDocuments();
    if (skillsCount === 0) {
      await db.collection('skills').insertMany(defaultSkills);
    }

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        message:
          'Admin account created and default data seeded successfully',
      })
    );
  } catch (error: any) {
    console.error('Seed error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ success: false, error: 'Internal server error' })
    );
  }
}
