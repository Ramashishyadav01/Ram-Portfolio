import { motion } from 'framer-motion';
import { Calendar, GraduationCap, MapPin } from 'lucide-react';

export default function Education() {
  const educationDetails = {
    degree: 'Bachelor of Technology (B.Tech)',
    major: 'Computer Science & Engineering',
    institution: 'UPTU Affiliated Technical University',
    duration: '2020 - 2024',
    location: 'Uttar Pradesh, India',
    description:
      'Completed full curriculum focusing on computer systems architecture, data structures, algorithms, object-oriented programming, database management, and software engineering methodologies.',
    highlights: [
      'Focus areas: Data Structures & Algorithms, DBMS, Operating Systems, Web Technologies',
      'Completed capstone projects focusing on full stack web development architectures',
      'Active participant in coding hackathons and technical seminars',
    ],
  };

  return (
    <section id="education" className="py-20 relative">
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
            Academic Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Education Details
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Education Card */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl glass-panel relative border border-white/5 hover:border-accent-blue/20 transition-colors group"
          >
            {/* Top Row: Icon & Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
                  <GraduationCap size={28} />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {educationDetails.degree}
                  </h3>
                  <p className="text-sm text-accent-cyan font-semibold">
                    {educationDetails.major}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end text-sm text-gray-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-accent-blue" />
                  <span>{educationDetails.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin size={14} className="text-gray-500" />
                  <span>{educationDetails.location}</span>
                </div>
              </div>
            </div>

            {/* Description & Highlights */}
            <div className="pt-6 text-left space-y-6">
              <div className="text-gray-300 font-medium">
                {educationDetails.institution}
              </div>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                {educationDetails.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Key Academic Highlights
                </h4>
                <ul className="grid grid-cols-1 gap-2.5">
                  {educationDetails.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2 text-sm text-gray-400 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
