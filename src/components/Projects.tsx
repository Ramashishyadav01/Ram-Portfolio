import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Github } from './icons';
import fitJourneyImg from '../assets/fit-journey.jpg';
import eShopImg from '../assets/e-shop.jpg';
import chatAppImg from '../assets/chat-app.jpg';

export default function Projects() {
  const projects = [
    {
      title: 'E-Shop (E-Commerce Platform)',
      description: [
        'Full-stack platform with dynamic product catalog, JWT + RBAC authentication, category management & filtering; optimized MongoDB queries for sub-200ms API response times.',
        'Built fully responsive React.js + Tailwind CSS UI with real-time state management for cart updates, search filtering, and seamless checkout; RESTful APIs with role-based admin and customer endpoints.'
      ],
      tech: ['React.js', 'Redux', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Stripe', 'JWT'],
      image: eShopImg,
      github: 'https://github.com/Ramashishyadav01/E-Shop',
      demo: 'https://e-shop-demo.vercel.app',
    },
    {
      title: 'Chatify (Real-Time Chat Application)',
      description: [
        'Bidirectional real-time communication via Socket.io (WebSockets) supporting 200+ simultaneous sessions; JWT-based auth middleware and MongoDB-based persistent chat history across user sessions.',
        'Built typing indicators, read receipts, and dynamic active user lists — responsive React.js + Tailwind CSS cross-device experience.'
      ],
      tech: ['React.js', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB', 'Tailwind CSS', 'JWT'],
      image: chatAppImg,
      github: 'https://github.com/Ramashishyadav01/Chatify',
      demo: 'https://chat-room-live.vercel.app',
    },
    {
      title: 'Fit-Journey (Fitness Tracking App)',
      description: [
        'Developed a responsive frontend fitness dashboard for tracking daily workouts and visualizing health metrics; integrated API endpoints for secure user authentication and dynamic workout logs deployed on Vercel with CI/CD pipeline.',
        'Implemented robust client-side error handling and form input validation; maintained detailed GitHub documentation for UI components and application state logic throughout development.'
      ],
      tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
      image: fitJourneyImg,
      github: 'https://github.com/Ramashishyadav01/Fit-Journey',
      demo: 'https://fit-journey.vercel.app',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-charcoal-dark/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-wider text-accent-blue uppercase mb-2"
          >
            My Creations
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Featured Projects
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="flex flex-col rounded-2xl glass-panel overflow-hidden border border-white/5 hover:border-accent-blue/30 transition-all duration-300 group"
            >
              {/* Project Image */}
              <div className="h-48 overflow-hidden relative bg-charcoal-dark">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Body */}
              <div className="flex-grow p-6 flex flex-col justify-between text-left space-y-5">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-accent-blue transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Detailed Recruiter-friendly bullet points */}
                  <ul className="space-y-2.5">
                    {project.description.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="flex items-start space-x-2 text-xs leading-relaxed text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pt-3 border-t border-white/5">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((badge) => (
                      <span
                        key={badge}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-semibold text-gray-400"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center gap-4 pt-1">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 text-xs font-semibold text-accent-blue hover:text-accent-cyan transition-colors duration-200"
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
