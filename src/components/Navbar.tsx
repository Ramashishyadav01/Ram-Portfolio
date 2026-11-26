import { useState, useEffect, useRef } from 'react';
import { Menu, X, Download, Eye, ChevronDown, Upload, RotateCcw, LogOut, LayoutDashboard, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { useAuth } from '../hooks/useAuth';
import AdminLoginModal from './admin/AdminLoginModal';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { resumeUrl, resumeName, isCustomResume, replaceResume, resetResume } = usePortfolioData();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) {
        setIsResumeOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(targetId);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      replaceResume(file);
    }
    e.target.value = '';
    setIsResumeOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel bg-charcoal/80 border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Left Side: Logo & Name */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan flex items-center justify-center font-bold text-white shadow-lg shadow-accent-blue/20 group-hover:scale-105 transition-transform duration-300">
              RA
            </div>
            <span className="font-semibold text-lg tracking-wide text-white group-hover:text-accent-blue transition-colors duration-300">
              Ram Ashish Yadav
            </span>
          </a>

          {/* Right Side: Desktop Nav */}
          <div className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}

            {/* Resume Dropdown */}
            <div className="relative" ref={resumeRef}>
              <button
                onClick={() => setIsResumeOpen(!isResumeOpen)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-300 cursor-pointer focus:outline-none ${
                  isAdmin
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400'
                    : 'border-white/10 hover:border-accent-blue hover:text-white bg-white/5'
                }`}
              >
                <span>Resume</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${
                    isResumeOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isResumeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl glass-panel bg-charcoal/95 border border-white/10 py-2 shadow-2xl text-left z-50 backdrop-blur-md"
                  >
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsResumeOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Eye size={14} className="text-accent-blue" />
                      <span>View Resume</span>
                    </a>
                    <a
                      href={resumeUrl}
                      download={resumeName}
                      onClick={() => setIsResumeOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Download size={14} className="text-accent-cyan" />
                      <span>Download Resume</span>
                    </a>

                    <div className="border-t border-white/10 my-1.5" />

                    {/* Admin Options */}
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors text-left cursor-pointer font-medium"
                        >
                          <Upload size={14} />
                          <span>Replace Resume</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsResumeOpen(false);
                            navigate('/admin/dashboard');
                          }}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors text-left cursor-pointer font-medium"
                        >
                          <LayoutDashboard size={14} />
                          <span>Admin Dashboard</span>
                        </button>
                        {isCustomResume && (
                          <button
                            onClick={() => {
                              setIsResumeOpen(false);
                              resetResume();
                            }}
                            className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                          >
                            <RotateCcw size={14} />
                            <span>Reset to Default</span>
                          </button>
                        )}
                        <div className="border-t border-white/10 my-1" />
                        <button
                          onClick={() => {
                            setIsResumeOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Exit Admin Mode</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setIsResumeOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors text-left cursor-pointer font-medium"
                      >
                        <Lock size={13} />
                        <span>Admin Login / Edit</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Badge if logged in */}
            {isAdmin && (
              <div className="flex items-center space-x-2 pl-1">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wide hover:bg-emerald-500/25 transition-all cursor-pointer flex items-center space-x-1"
                  title="Open Admin Dashboard"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DASHBOARD</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 glass-panel bg-charcoal/95 border-b border-white/5 py-6 px-6 shadow-2xl"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const id = item.href.replace('#', '');
                  const isActive = activeSection === id;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`text-base font-medium transition-colors duration-200 py-1 ${
                        isActive ? 'text-accent-blue' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                })}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all bg-white/5"
                  >
                    <Eye size={14} />
                    <span>View Resume</span>
                  </a>
                  <a
                    href={resumeUrl}
                    download={resumeName}
                    className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan text-sm font-semibold text-white shadow-lg shadow-accent-blue/20 hover:opacity-90 transition-all duration-300"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                </div>

                {isAdmin ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        fileInputRef.current?.click();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold border border-emerald-500/30"
                    >
                      <Upload size={14} />
                      <span>Replace Resume</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/admin/dashboard');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30"
                    >
                      <LayoutDashboard size={14} />
                      <span>Admin Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-rose-400 text-xs"
                    >
                      <LogOut size={12} />
                      <span>Exit Admin Mode</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full bg-white/5 text-amber-300 text-sm font-semibold border border-white/10 mt-2"
                  >
                    <Lock size={14} />
                    <span>Admin Login / Edit</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hidden file input for one-click direct resume upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsResumeOpen(true);
        }}
      />
    </>
  );
}
