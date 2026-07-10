import { Mail, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from './icons';
import profileImg from '../assets/profile.jpg';

export default function Hero() {
  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '-3s' }} />

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
        {/* Left Side: Profile Image */}
        <div className="col-span-1 md:col-span-5 flex justify-center order-first md:order-last">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Glowing Backdrop Border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-indigo opacity-75 blur-xl -z-10 animate-pulse duration-3000" />
            
            {/* Main Avatar Container */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-64 h-64 sm:w-72 sm:h-72 rounded-full p-1 bg-gradient-to-r from-accent-blue to-accent-cyan shadow-2xl shadow-accent-blue/30 overflow-hidden"
            >
              <img
                src={profileImg}
                alt="Ram Ashish Yadav"
                className="w-full h-full object-cover rounded-full bg-charcoal"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Title & Description */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2"
          >
            <span className="h-0.5 w-8 bg-accent-blue rounded-full"></span>
            <span className="text-sm font-semibold tracking-wider text-accent-blue uppercase">
              Welcome to my portfolio
            </span>
          </motion.div>

          <div className="space-y-3">
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 text-lg sm:text-xl font-medium tracking-wide"
            >
              Hi, I'm a
            </motion.h4>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Ram Ashish Yadav
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-blue bg-size-200 animate-gradient text-transparent bg-clip-text"
            >
              Full Stack Developer | MERN Stack | React.js | Node.js | REST APIs
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Computer Science graduate passionate about building scalable, responsive and user-friendly web applications using modern technologies.
          </motion.p>

          {/* Social Icons & Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4"
          >
            <div className="flex items-center gap-4">
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="group flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan font-semibold text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all duration-300"
              >
                <span>Contact Me</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a
                href="/resume.pdf"
                download="Ram_Ashish_Yadav_Resume.pdf"
                className="flex items-center space-x-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 font-semibold text-gray-300 hover:border-accent-blue hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Download size={16} />
                <span>Resume</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 pl-1">
              <a
                href="https://github.com/Ramashishyadav01"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:yadavramashish42449@gmail.com"
                className="p-2.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
