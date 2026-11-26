import { createContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { PortfolioData, SkillItem, ProjectData, AboutData, ContactData, ExperienceData } from '../types/portfolio';
import eShopImg from '../assets/e-shop.jpg';
import chatAppImg from '../assets/chatify.png';
import fitJourneyImg from '../assets/fit-journey.png';

export interface PortfolioDataContextType {
  data: PortfolioData | null;
  isLoading: boolean;
  // Resume
  resumeUrl: string;
  resumeName: string;
  isCustomResume: boolean;
  replaceResume: (file: File) => Promise<void>;
  deleteResume: () => Promise<void>;
  resetResume: () => void;
  // Experience
  experiences: ExperienceData[];
  addExperience: (exp: Omit<ExperienceData, '_id'>) => Promise<void>;
  updateExperience: (id: string, updates: Partial<ExperienceData>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  // Skills
  skills: SkillItem[];
  addSkill: (category: string, name: string, level?: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<SkillItem>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  // Projects
  projects: ProjectData[];
  addProject: (project: Omit<ProjectData, '_id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<ProjectData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  // About
  about: AboutData;
  updateAbout: (updates: Partial<AboutData>) => Promise<void>;
  // Contact
  contact: ContactData;
  updateContact: (updates: Partial<ContactData>) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const DEFAULT_RESUME_URL = '/Ram_Ashish_Yadav_Resume.pdf';
export const DEFAULT_RESUME_NAME = 'Ram_Ashish_Yadav_Resume.pdf';

const RESUME_STORAGE_KEY = 'portfolio_resume_data';
const RESUME_NAME_KEY = 'portfolio_resume_name';
const EXPERIENCE_STORAGE_KEY = 'portfolio_experience_data';
const SKILLS_STORAGE_KEY = 'portfolio_skills_data';
const PROJECTS_STORAGE_KEY = 'portfolio_projects_data';
const ABOUT_STORAGE_KEY = 'portfolio_about_data';
const CONTACT_STORAGE_KEY = 'portfolio_contact_data';

const initialDefaultSkills: SkillItem[] = [
  // Languages
  { _id: 'lang-1', category: 'Languages', name: 'JavaScript (ES6+)', level: 'Advanced', order: 0 },
  { _id: 'lang-2', category: 'Languages', name: 'TypeScript', level: 'Intermediate', order: 1 },
  { _id: 'lang-3', category: 'Languages', name: 'Java', level: 'Intermediate', order: 2 },

  // Frontend
  { _id: 'front-1', category: 'Frontend', name: 'React.js', level: 'Advanced', order: 0 },
  { _id: 'front-2', category: 'Frontend', name: 'Next.js', level: 'Intermediate', order: 1 },
  { _id: 'front-3', category: 'Frontend', name: 'Tailwind CSS', level: 'Advanced', order: 2 },
  { _id: 'front-4', category: 'Frontend', name: 'HTML5', level: 'Advanced', order: 3 },
  { _id: 'front-5', category: 'Frontend', name: 'CSS3', level: 'Advanced', order: 4 },
  { _id: 'front-6', category: 'Frontend', name: 'Context API', level: 'Advanced', order: 5 },
  { _id: 'front-7', category: 'Frontend', name: 'Redux', level: 'Intermediate', order: 6 },

  // Backend
  { _id: 'back-1', category: 'Backend', name: 'Node.js', level: 'Advanced', order: 0 },
  { _id: 'back-2', category: 'Backend', name: 'Express.js', level: 'Advanced', order: 1 },
  { _id: 'back-3', category: 'Backend', name: 'REST API design', level: 'Advanced', order: 2 },
  { _id: 'back-4', category: 'Backend', name: 'JWT', level: 'Advanced', order: 3 },
  { _id: 'back-5', category: 'Backend', name: 'Socket.io (WebSockets)', level: 'Intermediate', order: 4 },
  { _id: 'back-6', category: 'Backend', name: 'MVC architecture', level: 'Advanced', order: 5 },

  // Databases
  { _id: 'db-1', category: 'Databases', name: 'MongoDB (Mongoose ODM)', level: 'Advanced', order: 0 },
  { _id: 'db-2', category: 'Databases', name: 'MySQL', level: 'Intermediate', order: 1 },
  { _id: 'db-3', category: 'Databases', name: 'Query Optimization', level: 'Intermediate', order: 2 },
  { _id: 'db-4', category: 'Databases', name: 'Indexing', level: 'Intermediate', order: 3 },

  // Tools & DevOps
  { _id: 'tools-1', category: 'Tools & DevOps', name: 'Postman', level: 'Advanced', order: 0 },
  { _id: 'tools-2', category: 'Tools & DevOps', name: 'Jest', level: 'Intermediate', order: 1 },
  { _id: 'tools-3', category: 'Tools & DevOps', name: 'Git', level: 'Advanced', order: 2 },
  { _id: 'tools-4', category: 'Tools & DevOps', name: 'GitHub', level: 'Advanced', order: 3 },
  { _id: 'tools-5', category: 'Tools & DevOps', name: 'VS Code', level: 'Advanced', order: 4 },
  { _id: 'tools-6', category: 'Tools & DevOps', name: 'npm', level: 'Advanced', order: 5 },
  { _id: 'tools-7', category: 'Tools & DevOps', name: 'Docker', level: 'Intermediate', order: 6 },
  { _id: 'tools-8', category: 'Tools & DevOps', name: 'AWS', level: 'Beginner', order: 7 },
  { _id: 'tools-9', category: 'Tools & DevOps', name: 'CI/CD Pipeline', level: 'Intermediate', order: 8 },

  // Methodologies
  { _id: 'meth-1', category: 'Methodologies', name: 'Agile/Scrum', level: 'Advanced', order: 0 },
  { _id: 'meth-2', category: 'Methodologies', name: 'SDLC', level: 'Advanced', order: 1 },
  { _id: 'meth-3', category: 'Methodologies', name: 'RBAC', level: 'Advanced', order: 2 },
  { _id: 'meth-4', category: 'Methodologies', name: 'Input Sanitization', level: 'Advanced', order: 3 },
];

const initialDefaultProjects: ProjectData[] = [
  {
    _id: 'proj-1',
    title: 'E-Shop (E-Commerce Platform)',
    description: [
      'Full-stack platform with dynamic product catalog, JWT + RBAC authentication, category management & filtering; optimized MongoDB queries for sub-200ms API response times.',
      'Built fully responsive React.js + Tailwind CSS UI with real-time state management for cart updates, search filtering, and seamless checkout; RESTful APIs with role-based admin and customer endpoints.'
    ],
    tech: ['React.js', 'Redux', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    image: eShopImg,
    github: 'https://github.com/Ramashishyadav01/E-Shop',
    demo: '',
    status: 'published',
    order: 0,
  },
  {
    _id: 'proj-2',
    title: 'Chatify (Real-Time Chat Application)',
    description: [
      'Bidirectional real-time communication via Socket.io (WebSockets) supporting 200+ simultaneous sessions; JWT-based auth middleware and MongoDB-based persistent chat history across user sessions.',
      'Built typing indicators, read receipts, and dynamic active user lists — responsive React.js + Tailwind CSS cross-device experience.'
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB', 'Tailwind CSS', 'JWT'],
    image: chatAppImg,
    github: 'https://github.com/Ramashishyadav01/Chatify',
    demo: '',
    status: 'published',
    order: 1,
  },
  {
    _id: 'proj-3',
    title: 'Fit-Journey (Fitness Tracking App)',
    description: [
      'Developed a responsive frontend fitness dashboard for tracking daily workouts and visualizing health metrics; integrated API endpoints for secure user authentication and dynamic workout logs deployed on Vercel with CI/CD pipeline.',
      'Implemented robust client-side error handling and form input validation; maintained detailed GitHub documentation for UI components and application state logic throughout development.'
    ],
    tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
    image: fitJourneyImg,
    github: 'https://github.com/Ramashishyadav01/Fit-Journey',
    demo: 'https://fit-journey-wheat.vercel.app/',
    status: 'published',
    order: 2,
  },
];

const initialDefaultAbout: AboutData = {
  title: 'Results-Driven Full Stack|MERN Stack Developer',
  subtitle: 'Professional Introduction',
  description: [
    'I am a results-driven Full Stack Developer and React Developer with hands-on production experience building enterprise financial systems and MERN stack web applications. Delivered a multi-tier accounting system for a UAE-based company in a 60-day remote sprint. Proficient in React.js, Node.js, Express.js, MongoDB, JWT authentication, REST API design, WebSockets (Socket.io), and Agile/Scrum workflows.',
    'Passionate about building scalable, secure, and user-centric products. I thrive on translating complex problems into neat, functional, and highly performant applications, utilizing modern software practices to achieve optimal efficiency.'
  ],
  highlights: [
    {
      icon: 'BookOpen',
      title: 'Academic Foundation',
      desc: 'B.E. in Computer Science & Engineering graduate focusing on core software fundamentals, algorithms, databases, and systems.'
    },
    {
      icon: 'Cpu',
      title: 'Full Stack Specialisation',
      desc: 'Hands-on experience building MERN stack applications with React.js, Node.js, Express, MongoDB, and REST APIs.'
    },
    {
      icon: 'Award',
      title: 'Engineering Principles',
      desc: 'Focussed on writing secure, modular, and scalable code using JWT authentication, WebSockets, and clean design patterns.'
    }
  ],
  stats: [
    { value: 'B.E.', label: 'Computer Science' },
    { value: 'MERN', label: 'Full Stack Expert' }
  ]
};

const initialDefaultContact: ContactData = {
  email: 'yadavramashish42449@gmail.com',
  phone: '+91-7860470816',
  location: 'Noida, Uttar Pradesh, India',
  linkedin: 'https://www.linkedin.com/in/ramashishyadav01/',
  github: 'https://github.com/Ramashishyadav01',
  portfolio: '',
  additionalLinks: []
};

const initialDefaultExperiences: ExperienceData[] = [
  {
    _id: 'exp-1',
    role: 'Jr. Full Stack Developer (Intern)',
    company: 'Global Tech Reach',
    location: 'Dubai UAE (Remote)',
    period: 'Nov 2025 – Jan 2026',
    description: 'Delivered an enterprise-grade multi-tier Accounting & Financial Management System in a 60-day remote sprint.',
    achievements: [
      'Engineered a production-grade multi-tier Accounting System in 60 days — real-time Chart of Accounts, Double-Entry Journal with automated VAT & TDS calculation logic, and dynamic Cash Flow tracking used by the company\'s finance team.',
      'Built an Expense module with automated debit note generation, multi-mode payment processing, and optimized financial reporting & export tools deployed across all accounting modules — reducing manual effort by ~60%.',
      'Designed responsive React.js + Tailwind CSS dashboards; built REST APIs with Express.js and MongoDB; collaborated in an Agile remote team with Git branching and daily GitHub PR reviews.'
    ],
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'Git', 'Agile/Scrum'],
    order: 0
  }
];

function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/pdf';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

export const PortfolioDataContext = createContext<PortfolioDataContextType>({} as PortfolioDataContextType);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState<string>(DEFAULT_RESUME_URL);
  const [resumeName, setResumeName] = useState<string>(DEFAULT_RESUME_NAME);
  const [isCustomResume, setIsCustomResume] = useState<boolean>(false);

  // Skills
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDefaultSkills;
  });

  // Projects
  const [projects, setProjects] = useState<ProjectData[]>(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDefaultProjects;
  });

  // About
  const [about, setAbout] = useState<AboutData>(() => {
    try {
      const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDefaultAbout;
  });

  // Contact
  const [contact, setContact] = useState<ContactData>(() => {
    try {
      const stored = localStorage.getItem(CONTACT_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDefaultContact;
  });

  // Experiences
  const [experiences, setExperiences] = useState<ExperienceData[]>(() => {
    try {
      const stored = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialDefaultExperiences;
  });

  const blobUrlRef = useRef<string | null>(null);

  // Load custom resume from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(RESUME_STORAGE_KEY);
      const storedName = localStorage.getItem(RESUME_NAME_KEY);
      if (storedData) {
        const blob = dataUrlToBlobUrl(storedData);
        blobUrlRef.current = blob;
        setResumeUrl(blob);
        setResumeName(storedName || DEFAULT_RESUME_NAME);
        setIsCustomResume(true);
      }
    } catch {
      localStorage.removeItem(RESUME_STORAGE_KEY);
      localStorage.removeItem(RESUME_NAME_KEY);
    }
  }, []);

  // Fetch from backend API if available
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/data');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        setData(json);

        // Sync backend skills if available
        if (json.skills && Array.isArray(json.skills) && json.skills.length > 0) {
          setSkills(json.skills);
          localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(json.skills));
        }

        // Sync backend projects if available
        if (json.projects && Array.isArray(json.projects) && json.projects.length > 0) {
          setProjects(json.projects);
          localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(json.projects));
        }

        // Sync backend about if available
        if (json.about && typeof json.about === 'object') {
          setAbout(json.about);
          localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(json.about));
        }

        // Sync backend contact if available
        if (json.contact && typeof json.contact === 'object') {
          setContact(json.contact);
          localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(json.contact));
        }

        // Sync backend experience if available
        if (json.experience && Array.isArray(json.experience) && json.experience.length > 0) {
          setExperiences(json.experience);
          localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(json.experience));
        }

        // Sync backend resume if available
        if (json.resume?.url && !localStorage.getItem(RESUME_STORAGE_KEY)) {
          setResumeUrl(json.resume.url);
          setResumeName(json.resume.originalName || DEFAULT_RESUME_NAME);
          setIsCustomResume(true);
        }
      }
    } catch {
      // Backend not running locally; graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Replace resume
  const replaceResume = useCallback(async (file: File) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.');
      return;
    }

    const toastId = toast.loading('Replacing resume...');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        localStorage.setItem(RESUME_STORAGE_KEY, dataUrl);
        localStorage.setItem(RESUME_NAME_KEY, file.name);

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const newBlob = dataUrlToBlobUrl(dataUrl);
        blobUrlRef.current = newBlob;

        setResumeUrl(newBlob);
        setResumeName(file.name);
        setIsCustomResume(true);

        // Also sync to backend API if available
        try {
          const fd = new FormData();
          fd.append('resume', file);
          const token = localStorage.getItem('admin_token');
          await fetch('/api/admin/resume', {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: fd,
          });
        } catch {}

        toast.success(`Resume replaced with ${file.name}!`, { id: toastId });
      } catch {
        toast.error('Could not save resume.', { id: toastId });
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read resume file.', { id: toastId });
    };

    reader.readAsDataURL(file);
  }, []);

  // Delete resume
  const deleteResume = useCallback(async () => {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    localStorage.removeItem(RESUME_NAME_KEY);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setResumeUrl(DEFAULT_RESUME_URL);
    setResumeName(DEFAULT_RESUME_NAME);
    setIsCustomResume(false);

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/resume', {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}

    toast.success('Resume deleted. Reverted to default.');
  }, []);

  const resetResume = useCallback(() => {
    deleteResume();
  }, [deleteResume]);

  // Experience Management
  const addExperience = useCallback(async (newExpData: Omit<ExperienceData, '_id'>) => {
    const newExp: ExperienceData = {
      ...newExpData,
      _id: 'exp_' + Date.now(),
      order: newExpData.order !== undefined ? newExpData.order : experiences.length,
    };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newExp),
      });
    } catch {}

    toast.success(`Experience "${newExp.role}" added!`);
  }, [experiences]);

  const updateExperience = useCallback(async (id: string, updates: Partial<ExperienceData>) => {
    const updated = experiences.map((exp) => (exp._id === id ? { ...exp, ...updates } : exp));
    setExperiences(updated);
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/experience', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch {}

    toast.success('Experience updated!');
  }, [experiences]);

  const deleteExperience = useCallback(async (id: string) => {
    const updated = experiences.filter((exp) => exp._id !== id);
    setExperiences(updated);
    localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/admin/experience?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}

    toast.success('Experience deleted!');
  }, [experiences]);

  // Skills Management
  const addSkill = useCallback(async (category: string, name: string, level = 'Intermediate') => {
    const newSkill: SkillItem = {
      _id: 'skill_' + Date.now(),
      category,
      name,
      level,
      order: skills.filter((s) => s.category === category).length,
    };

    const updated = [...skills, newSkill];
    setSkills(updated);
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ category, name, order: newSkill.order }),
      });
    } catch {}

    toast.success(`Skill "${name}" added!`);
  }, [skills]);

  const updateSkill = useCallback(async (id: string, updates: Partial<SkillItem>) => {
    const updated = skills.map((s) => (s._id === id ? { ...s, ...updates } : s));
    setSkills(updated);
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch {}

    toast.success('Skill updated!');
  }, [skills]);

  const deleteSkill = useCallback(async (id: string) => {
    const updated = skills.filter((s) => s._id !== id);
    setSkills(updated);
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/admin/skills?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}

    toast.success('Skill deleted!');
  }, [skills]);

  // Projects Management
  const addProject = useCallback(async (newProjData: Omit<ProjectData, '_id'>) => {
    const newProject: ProjectData = {
      ...newProjData,
      _id: 'proj_' + Date.now(),
      order: projects.length,
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));

    // Try sync with API
    try {
      const token = localStorage.getItem('admin_token');
      const fd = new FormData();
      fd.append('title', newProject.title);
      fd.append('description', JSON.stringify(newProject.description));
      fd.append('tech', JSON.stringify(newProject.tech));
      fd.append('github', newProject.github);
      fd.append('demo', newProject.demo);
      fd.append('status', newProject.status);
      fd.append('order', String(newProject.order));

      await fetch('/api/admin/projects', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
    } catch {}

    toast.success(`Project "${newProject.title}" added!`);
  }, [projects]);

  const updateProject = useCallback(async (id: string, updates: Partial<ProjectData>) => {
    const updated = projects.map((p) => (p._id === id ? { ...p, ...updates } : p));
    setProjects(updated);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));

    // Try sync with API
    try {
      const token = localStorage.getItem('admin_token');
      const fd = new FormData();
      fd.append('id', id);
      if (updates.title) fd.append('title', updates.title);
      if (updates.description) fd.append('description', JSON.stringify(updates.description));
      if (updates.tech) fd.append('tech', JSON.stringify(updates.tech));
      if (updates.github !== undefined) fd.append('github', updates.github);
      if (updates.demo !== undefined) fd.append('demo', updates.demo);
      if (updates.status !== undefined) fd.append('status', updates.status);

      await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
    } catch {}

    toast.success('Project updated!');
  }, [projects]);

  const deleteProject = useCallback(async (id: string) => {
    const updated = projects.filter((p) => p._id !== id);
    setProjects(updated);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}

    toast.success('Project deleted!');
  }, [projects]);

  // About Management
  const updateAbout = useCallback(async (updates: Partial<AboutData>) => {
    const updated = { ...about, ...updates };
    setAbout(updated);
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updated),
      });
    } catch {}

    toast.success('About section updated!');
  }, [about]);

  // Contact Management
  const updateContact = useCallback(async (updates: Partial<ContactData>) => {
    const updated = { ...contact, ...updates };
    setContact(updated);
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(updated));

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updated),
      });
    } catch {}

    toast.success('Contact info updated!');
  }, [contact]);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        isLoading,
        resumeUrl,
        resumeName,
        isCustomResume,
        replaceResume,
        deleteResume,
        resetResume,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        projects,
        addProject,
        updateProject,
        deleteProject,
        about,
        updateAbout,
        contact,
        updateContact,
        refreshData: fetchData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}
