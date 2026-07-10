import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Github } from './icons';
import fitJourneyImg from '../assets/fit-journey.jpg';
import eShopImg from '../assets/e-shop.jpg';
import chatAppImg from '../assets/chat-app.jpg';

export default function Projects() {
  const projects = [
    {
      title: 'Fit-Journey',
      description:
        'A comprehensive fitness tracking web application that allows users to monitor their wellness, log daily workouts, check progress dashboards, and set goals. Designed with a focus on usability, clean data visualisation, and responsive layout.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
      image: fitJourneyImg,
      github: 'https://github.com/Ramashishyadav01/Fit-Journey',
      demo: 'https://fit-journey.vercel.app',
    },
    {
      title: 'E-Shop Full Stack E-commerce',
      description:
        'A full-featured premium web store showcasing clean design, checkout flow, and dashboard integration. Utilises a Spring Boot backend combined with React and Redux, featuring secure checkout via Stripe and JWT authentication.',
      tech: ['Spring Boot', 'React', 'Redux', 'MySQL', 'Stripe', 'JWT'],
      image: eShopImg,
      github: 'https://github.com/Ramashishyadav01/E-Shop',
      demo: 'https://e-shop-demo.vercel.app',
    },
    {
      title: 'Real-Time Chat Application',
      description:
        'A dynamic web application supporting instant message delivery, room creations, and online active statuses. Built with Socket.io web sockets on a Node.js/Express server and MongoDB for data storage.',
      tech: ['React', 'Node.js', 'Express.js', 'Socket.io', 'MongoDB'],
      image: chatAppImg,
      github: 'https://github.com/Ramashishyadav01/Realtime-Chat',
      demo: 'https://chat-room-live.vercel.app',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="flex-1 p-6 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-accent-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
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
                  <div className="flex items-center gap-4 pt-1 border-t border-white/5">
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
