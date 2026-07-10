import { motion } from 'framer-motion';
import { Award, BookOpen, Cpu } from 'lucide-react';

export default function About() {
  const cards = [
    {
      icon: <BookOpen className="text-accent-blue" size={24} />,
      title: 'Education',
      desc: 'B.Tech in Computer Science graduate focusing on core software fundamentals, algorithms, and web design.',
    },
    {
      icon: <Cpu className="text-accent-cyan" size={24} />,
      title: 'Full Stack Skills',
      desc: 'Skilled in building complete applications from responsive frontends to database-driven backends.',
    },
    {
      icon: <Award className="text-accent-indigo" size={24} />,
      title: 'Clean Architecture',
      desc: 'Focussed on writing maintainable, well-structured, and reusable code with robust system design.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-charcoal-dark/40 relative">
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
            About Me
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Professional Introduction
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-6 space-y-6 text-left"
          >
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Passionate Computer Science Graduate & Developer
            </h3>
            
            <p className="text-gray-400 leading-relaxed">
              I am a dedicated software engineer with a strong academic background in Computer Science. My core specialty lies in building responsive, scalable, and user-centric web applications using the MERN stack (MongoDB, Express, React, Node.js) and other modern frameworks.
            </p>

            <p className="text-gray-400 leading-relaxed">
              I love turning complex problems into simple, beautiful, and intuitive interface solutions. My goal is to build software that not only functions flawlessly under the hood but also delivers a premium, smooth user experience.
            </p>

            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-white">B.Tech</div>
                  <div className="text-xs text-gray-400">Computer Science</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl font-bold text-white">MERN</div>
                  <div className="text-xs text-gray-400">Full Stack Expert</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Highlights cards */}
          <div className="col-span-1 lg:col-span-6 grid grid-cols-1 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex items-start space-x-4 p-6 rounded-2xl glass-panel hover:border-accent-blue/30 transition-all duration-300 group"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-accent-blue/10 group-hover:border-accent-blue/25 transition-all duration-300">
                  {card.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-accent-blue transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
