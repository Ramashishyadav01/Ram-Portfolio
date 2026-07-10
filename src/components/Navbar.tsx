import { useState, useEffect, useRef } from 'react';
import { Menu, X, Download, Eye, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
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
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
        <div className="hidden md:flex items-center space-x-8">
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
              className="flex items-center space-x-1 px-4 py-2 rounded-full border border-white/10 text-xs font-semibold hover:border-accent-blue hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10 bg-white/5 cursor-pointer focus:outline-none"
            >
              <span>Resume</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${isResumeOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isResumeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 rounded-xl glass-panel bg-charcoal/95 border border-white/5 py-1.5 shadow-xl text-left"
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsResumeOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Eye size={12} />
                    <span>View Resume</span>
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Ram_Ashish_Yadav_Resume.pdf"
                    onClick={() => setIsResumeOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Download size={12} />
                    <span>Download Resume</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            className="md:hidden absolute top-full left-0 right-0 glass-panel bg-charcoal/95 border-b border-white/5 py-6 px-6"
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
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all bg-white/5"
                >
                  <Eye size={14} />
                  <span>View</span>
                </a>
                <a
                  href="/resume.pdf"
                  download="Ram_Ashish_Yadav_Resume.pdf"
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan text-sm font-semibold text-white shadow-lg shadow-accent-blue/20 hover:opacity-90 transition-all duration-300"
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
