import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';

export default function Certifications() {
  const certifications = [
    {
      title: 'Java Programming Certification',
      issuer: 'Intern Certify',
      description: 'Advanced Java programming concepts including object-oriented programming, data structures, multithreading, and collections framework.',
      link: 'https://drive.google.com/file/d/1Fcnab4JpY0lQwsBXtNyO-1U02jr1_l5g/view?usp=drive_link',
    },
    {
      title: 'The Complete Full Stack Web Development Bootcamp',
      issuer: 'Udemy',
      description: 'Comprehensive training in modern web technologies including HTML, CSS, JavaScript, React, Node.js, Express, and Databases.',
      link: 'https://drive.google.com/file/d/1JZ-EUpAOHAzpY_aiz3wZg8RBkLYTEDID/view?usp=drive_link',
    },
    {
      title: 'Oracle AI Foundations Associate',
      issuer: 'Oracle',
      description: 'Foundations of artificial intelligence, machine learning concepts, and Oracle Cloud Infrastructure AI services.',
      link: 'https://drive.google.com/file/d/13fzaq5r1_TU6-dWmtZ8OtsZLuV1e9rH1/view?usp=drive_link',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="certifications" className="py-20 bg-charcoal-dark/40 relative">
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
            Verified Credentials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Certifications
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Certifications Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="flex flex-col justify-between p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-accent-blue/30 transition-all duration-300 border border-white/5"
            >
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue group-hover:bg-accent-blue/20 transition-all duration-300">
                    <Award size={22} />
                  </div>
                  
                  {cert.link !== '#' && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-white hover:text-accent-blue transition-colors duration-200"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-accent-blue transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-accent-cyan font-semibold uppercase tracking-wider">
                    {cert.issuer}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed pt-1">
                    {cert.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
