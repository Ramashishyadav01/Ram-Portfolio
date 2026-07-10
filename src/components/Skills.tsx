import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Code, Layout, Server, Database, Settings, ShieldCheck } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'Languages',
      icon: <Code className="text-accent-blue" size={22} />,
      skills: ['JavaScript (ES6+)', 'TypeScript', 'Java'],
      gradient: 'from-blue-500/20 to-indigo-500/10',
    },
    {
      title: 'Frontend',
      icon: <Layout className="text-accent-cyan" size={22} />,
      skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS3', 'Context API', 'Redux'],
      gradient: 'from-cyan-500/20 to-blue-500/10',
    },
    {
      title: 'Backend',
      icon: <Server className="text-accent-indigo" size={22} />,
      skills: ['Node.js', 'Express.js', 'REST API design', 'JWT', 'Socket.io (WebSockets)', 'MVC architecture'],
      gradient: 'from-indigo-500/20 to-purple-500/10',
    },
    {
      title: 'Databases',
      icon: <Database className="text-accent-cyan" size={22} />,
      skills: ['MongoDB (Mongoose ODM)', 'MySQL', 'Query Optimization', 'Indexing'],
      gradient: 'from-purple-500/20 to-pink-500/10',
    },
    {
      title: 'Tools & DevOps',
      icon: <Settings className="text-white" size={22} />,
      skills: ['Postman', 'Jest', 'Git', 'GitHub', 'VS Code', 'npm', 'Docker', 'AWS', 'CI/CD Pipeline'],
      gradient: 'from-pink-500/20 to-blue-500/10',
    },
    {
      title: 'Methodologies',
      icon: <ShieldCheck className="text-accent-blue" size={22} />,
      skills: ['Agile/Scrum', 'SDLC', 'RBAC', 'Input Sanitization'],
      gradient: 'from-blue-500/20 to-purple-500/10',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="skills" className="py-20 relative">
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
            My Expertise
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Technical Skills
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-accent-blue/30 transition-all duration-300`}
            >
              {/* Card Gradient Background Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />

              <div className="flex items-center space-x-3.5 mb-5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/5 hover:border-accent-blue/30 hover:text-white hover:bg-accent-blue/10 transition-all duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
