import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
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
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'Git', 'Agile/Scrum']
    }
  ];

  return (
    <section id="experience" className="py-20 relative">
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
            Career & Internship
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Work Experience
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Experience Cards */}
        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="p-8 rounded-2xl glass-panel relative border border-white/5 hover:border-accent-blue/30 transition-all duration-300 group text-left"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue group-hover:bg-accent-blue/20 transition-all duration-300 mt-1">
                    <Briefcase size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-accent-blue transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-accent-cyan mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end text-sm text-gray-400">
                  <div className="flex items-center gap-1.5 font-medium text-gray-300">
                    <Calendar size={14} className="text-accent-blue" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 font-medium text-gray-400">
                    <MapPin size={14} className="text-gray-500" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Description & Bullet points */}
              <div className="pt-6 space-y-4">
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {exp.description}
                </p>

                <ul className="space-y-3">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-gray-400 leading-relaxed">
                      <CheckCircle2 size={16} className="text-accent-blue mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Skill Badges */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 hover:border-accent-blue/40 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
