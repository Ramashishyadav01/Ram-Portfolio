import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader, Globe } from 'lucide-react';
import { Github, Linkedin } from './icons';
import { usePortfolioData } from '../hooks/usePortfolioData';

export default function Contact() {
  const { contact } = usePortfolioData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [lastSubTime, setLastSubTime] = useState<number>(0);

  const email = contact.email || 'yadavramashish42449@gmail.com';
  const phone = contact.phone || '+91-7860470816';
  const location = contact.location || 'Noida, Uttar Pradesh, India';
  const linkedin = contact.linkedin || 'https://www.linkedin.com/in/ramashishyadav01/';
  const github = contact.github || 'https://github.com/Ramashishyadav01';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error' || status === 'success') {
      setStatus('idle');
      setErrorMessage('');
      setSuccessMessage('');
    }
  };

  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'loading') return;

    // Prevent duplicate submissions within 5 seconds
    const now = Date.now();
    if (now - lastSubTime < 5000) {
      setStatus('error');
      setErrorMessage('Please wait a few seconds before sending another message.');
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    // Validation
    if (!trimmedName || trimmedName.length < 2) {
      setStatus('error');
      setErrorMessage('Please enter your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      setStatus('error');
      setErrorMessage('Please enter a message (at least 5 characters).');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Try Vercel / Local Dev Serverless Endpoint (/api/contact)
      try {
        const response = await fetchWithTimeout(
          '/api/contact',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              name: trimmedName,
              email: trimmedEmail,
              subject: trimmedSubject,
              message: trimmedMessage,
            }),
          },
          5000
        );

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const resData = await response.json();
          if (resData && resData.success) {
            setStatus('success');
            setSuccessMessage(
              resData.message || 'Thanks for reaching out! I will get back to you as soon as possible.'
            );
            setLastSubTime(Date.now());
            setFormData({ name: '', email: '', subject: '', message: '' });
            return;
          }
        }
      } catch (err) {
        console.warn('/api/contact endpoint timed out or unavailable, trying direct fallbacks:', err);
      }

      // 2. Try Direct Web3Forms if key is configured
      const accessKey =
        (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
        (import.meta as any).env?.WEB3FORMS_ACCESS_KEY;

      if (accessKey && accessKey !== 'your_web3forms_access_key_here') {
        try {
          const directRes = await fetchWithTimeout(
            'https://api.web3forms.com/submit',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({
                access_key: accessKey,
                name: trimmedName,
                email: trimmedEmail,
                subject: trimmedSubject || `New Portfolio Contact Message from ${trimmedName}`,
                message: trimmedMessage,
                from_name: "Ram's Portfolio",
              }),
            },
            5000
          );

          const directData = await directRes.json();
          if (directRes.ok && directData.success) {
            setStatus('success');
            setSuccessMessage('Thanks for reaching out! Your message was sent successfully.');
            setLastSubTime(Date.now());
            setFormData({ name: '', email: '', subject: '', message: '' });
            return;
          }
        } catch (err) {
          console.warn('Direct Web3Forms fallback timed out or failed:', err);
        }
      }

      // 3. Try FormSubmit AJAX fallback directly
      try {
        const fsRes = await fetchWithTimeout(
          `https://formsubmit.co/ajax/${email}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              name: trimmedName,
              email: trimmedEmail,
              _subject: trimmedSubject || `Portfolio Message from ${trimmedName}`,
              message: trimmedMessage,
              _captcha: 'false',
            }),
          },
          5000
        );

        const fsData = await fsRes.json();
        if (fsRes.ok && (fsData.success === 'true' || fsData.success === true)) {
          setStatus('success');
          setSuccessMessage('Thanks for reaching out! I will get back to you as soon as possible.');
          setLastSubTime(Date.now());
          setFormData({ name: '', email: '', subject: '', message: '' });
          return;
        } else if (fsData.message && fsData.message.includes('needs Activation')) {
          setStatus('success');
          setSuccessMessage(
            `Form activation required: An activation email has been sent to ${email}. Please click 'Activate Form' in your inbox to complete setup!`
          );
          setLastSubTime(Date.now());
          setFormData({ name: '', email: '', subject: '', message: '' });
          return;
        }
      } catch (err) {
        console.warn('Direct FormSubmit fallback timed out or failed:', err);
      }

      // 4. Fallback: prompt to email directly
      throw new Error(
        `Unable to send message automatically. Please contact directly via email: ${email}`
      );
    } catch (err: any) {
      console.error('Contact Form Submit Error:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'An unexpected error occurred while sending your message. Please try again.'
      );
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="text-accent-blue" size={20} />,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <Phone className="text-accent-cyan" size={20} />,
      label: 'Phone',
      value: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
    },
    {
      icon: <MapPin className="text-accent-indigo" size={20} />,
      label: 'Location',
      value: location,
      href: '#',
    },
    {
      icon: <Linkedin className="text-accent-cyan" size={20} />,
      label: 'LinkedIn',
      value: linkedin.replace(/^https?:\/\/(www\.)?/, ''),
      href: linkedin,
    },
    {
      icon: <Github className="text-accent-indigo" size={20} />,
      label: 'GitHub',
      value: github.replace(/^https?:\/\/(www\.)?/, ''),
      href: github,
    },
    ...(contact.additionalLinks?.map((link) => ({
      icon: <Globe className="text-accent-blue" size={20} />,
      label: link.label,
      value: link.url.replace(/^https?:\/\/(www\.)?/, ''),
      href: link.url,
    })) || []),
  ];

  return (
    <section id="contact" className="py-20 bg-charcoal-dark/40 relative">
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
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Contact Information
          </motion.h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full mt-4"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-5 space-y-8 flex flex-col justify-center text-left"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Let's discuss your next project
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                I am open to full-time opportunities, Full Stack Developer roles, and collaborations. Feel free to connect with me via email, LinkedIn, or by filling out the message form.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => {
                const isAnchor = info.href !== '#';
                const content = (
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-blue/30 transition-all duration-300 group cursor-default">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:bg-accent-blue/10 group-hover:border-accent-blue/25 transition-all duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {info.label}
                      </h4>
                      <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-200">
                        {info.value}
                      </p>
                    </div>
                  </div>
                );

                return isAnchor ? (
                  <a
                    key={info.label}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={info.label}>{content}</div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="col-span-1 lg:col-span-7"
          >
            <div className="p-8 rounded-2xl glass-panel border border-white/5 text-left">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Name <span className="text-accent-blue">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-charcoal border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-300"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Email <span className="text-accent-blue">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-charcoal border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-charcoal border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-300"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Message <span className="text-accent-blue">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    rows={5}
                    placeholder="Hello Ram, I would like to discuss..."
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-charcoal border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan text-sm font-semibold text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 disabled:opacity-50 transition-all duration-300"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Message Sent Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Form feedback status alerts */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                  >
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {successMessage || 'Thanks for reaching out! I will get back to you as soon as possible.'}
                    </span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"
                  >
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span>{errorMessage || 'Failed to submit. Please fill out all required fields.'}</span>
                      {errorMessage.includes(email) && (
                        <div className="mt-2">
                          <a
                            href={`mailto:${email}?subject=${encodeURIComponent(
                              formData.subject || 'Portfolio Inquiry'
                            )}&body=${encodeURIComponent(
                              `Hi Ram,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
                            )}`}
                            className="inline-flex items-center text-xs font-semibold text-accent-cyan underline hover:text-white"
                          >
                            Click to send directly via Email App
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
