import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Code2,
  User,
  FolderKanban,
  Mail,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Resume', icon: FileText, to: '/admin/resume' },
  { label: 'Experience', icon: Briefcase, to: '/admin/experience' },
  { label: 'Skills', icon: Code2, to: '/admin/skills' },
  { label: 'About Me', icon: User, to: '/admin/about' },
  { label: 'Projects', icon: FolderKanban, to: '/admin/projects' },
  { label: 'Contact', icon: Mail, to: '/admin/contact' },
] as const;

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-[#111827] border-r border-gray-800">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            RA
          </div>
          <span className="text-white font-semibold text-lg">Admin Panel</span>
          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="ml-auto lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-[3px] border-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border-l-[3px] border-transparent'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-600/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full shrink-0">{sidebarContent}</div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onToggle}
          />
          {/* Sidebar */}
          <div className="relative h-full w-64 shadow-2xl">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
