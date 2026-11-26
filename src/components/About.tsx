import { motion } from 'framer-motion';
import { Award, BookOpen, Cpu, Star, GraduationCap, Briefcase, Code, CheckCircle } from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';

function getHighlightIcon(name: string, index: number) {
  const iconProps = {
    size: 24,
    className:
      index === 0
        ? 'text-accent-blue'
        : index === 1
        ? 'text-accent-cyan'
        : 'text-accent-indigo',
  };

  switch (name?.toLowerCase()) {
    case 'bookopen':
    case 'education':
      return <BookOpen {...iconProps} />;
    case 'cpu':
    case 'stack':
      return <Cpu {...iconProps} />;
    case 'award':
    case 'achievement':
      return <Award {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'graduationcap':
      return <GraduationCap {...iconProps} />;
    case 'briefcase':
      return <Briefcase {...iconProps} />;
    case 'code':
      return <Code {...iconProps} />;
    default:
      return <CheckCircle {...iconProps} />;
  }
}

export default function About() {
  const { about } = usePortfolioData();

  const title = about.title || 'Results-Driven Full Stack|MERN Stack Developer';
  const subtitle = about.subtitle || 'Professional Introduction';
  const paragraphs =
    about.description && about.description.length > 0
      ? about.description
      : [
          'I am a results-driven Full Stack Developer and React Developer with hands-on production experience building enterprise financial systems and MERN stack web applications.',
          'Passionate about building scalable, secure, and user-centric products.',
        ];
  const stats =
    about.stats && about.stats.length > 0
      ? about.stats
      : [
          { value: 'B.E.', label: 'Computer Science' },
          { value: 'MERN', label: 'Full Stack Expert' },
        ];

  const cards =
    about.highlights && about.highlights.length > 0
      ? about.highlights.map((h, idx) => ({
          icon: getHighlightIcon(h.icon, idx),
          title: h.title,
          desc: h.desc,
        }))
      : [
          {
            icon: <BookOpen className="text-accent-blue" size={24} />,
            title: 'Academic Foundation',
            desc: 'B.E. in Computer Science & Engineering graduate focusing on core software fundamentals, algorithms, databases, and systems.',
          },
          {
            icon: <Cpu className="text-accent-cyan" size={24} />,
            title: 'Full Stack Specialisation',
            desc: 'Hands-on experience building MERN stack applications with React.js, Node.js, Express, MongoDB, and REST APIs.',
          },
          {
            icon: <Award className="text-accent-indigo" size={24} />,
            title: 'Engineering Principles',
            desc: 'Focussed on writing secure, modular, and scalable code using JWT authentication, WebSockets, and clean design patterns.',
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
            {subtitle}
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
              {title}
            </h3>

            {paragraphs.map((para, i) => (
              <p key={i} className="text-gray-400 leading-relaxed">
                {para}
              </p>
            ))}

            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Highlights cards */}
          <div className="col-span-1 lg:col-span-6 grid grid-cols-1 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.title || index}
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
