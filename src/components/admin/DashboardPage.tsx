import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Code2,
  FileText,
  UserCheck,
  ArrowRight,
  Mail,
  User,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePortfolioData } from '../../hooks/usePortfolioData';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const quickActions = [
  { label: 'Upload & Replace Resume', to: '/admin/resume', icon: FileText, color: 'rose' },
  { label: 'Manage Experience', to: '/admin/experience', icon: Briefcase, color: 'cyan' },
  { label: 'Manage Technical Skills', to: '/admin/skills', icon: Code2, color: 'purple' },
  { label: 'Manage Projects', to: '/admin/projects', icon: FolderKanban, color: 'blue' },
  { label: 'Update About Me', to: '/admin/about', icon: User, color: 'emerald' },
  { label: 'Update Contact Info', to: '/admin/contact', icon: Mail, color: 'amber' },
] as const;

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  purple: 'bg-purple-500/20 text-purple-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/20 text-rose-400',
};

export default function DashboardPage() {
  const { admin } = useAuth();
  const { skills, projects, experiences, isCustomResume } = usePortfolioData();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const summaryCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Total Experience',
      value: experiences.length,
      icon: Briefcase,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Total Skills',
      value: skills.length,
      icon: Code2,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Resume Status',
      value: isCustomResume ? 'Custom File' : 'Default Preset',
      icon: FileText,
      iconBg: isCustomResume ? 'bg-emerald-500/20' : 'bg-blue-500/20',
      iconColor: isCustomResume ? 'text-emerald-400' : 'text-blue-400',
    },
    {
      title: 'Profile Completion',
      value: '100%',
      icon: UserCheck,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-800">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Welcome back, {admin?.name ?? 'Ram'} 👋
          </h1>
          <p className="text-gray-400 mt-1 text-xs">{today}</p>
        </div>
        <Link
          to="/"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors flex items-center space-x-1.5"
        >
          <span>View Public Portfolio</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-white mt-1.5">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <card.icon size={20} className={card.iconColor} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-center gap-4 rounded-2xl bg-gray-800/40 border border-gray-700/50 p-5 hover:border-blue-500/40 hover:bg-gray-800/60 transition-all shadow-md"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[action.color]}`}
              >
                <action.icon size={18} />
              </div>
              <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                {action.label}
              </span>
              <ArrowRight
                size={16}
                className="ml-auto text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
