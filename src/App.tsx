import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { PortfolioDataProvider } from './context/PortfolioDataContext';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './components/admin/DashboardPage';
import ResumeManager from './components/admin/ResumeManager';
import ExperienceManager from './components/admin/ExperienceManager';
import SkillsManager from './components/admin/SkillsManager';
import AboutManager from './components/admin/AboutManager';
import ProjectsManager from './components/admin/ProjectsManager';
import ContactManager from './components/admin/ContactManager';

function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'experience',
        'skills',
        'projects',
        'education',
        'certifications',
        'contact',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-charcoal min-h-screen text-gray-100 flex flex-col font-sans selection:bg-accent-blue/30 selection:text-white overflow-hidden">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-grow">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioDataProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '0.75rem',
              },
            }}
          />
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<Portfolio />} />

            {/* Admin Login Route */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="resume" element={<ResumeManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="contact" element={<ContactManager />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
