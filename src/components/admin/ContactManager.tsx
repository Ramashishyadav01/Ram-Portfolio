import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Loader, Mail, Phone, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { ContactData } from '../../types/portfolio';

export default function ContactManager() {
  const { contact, updateContact } = usePortfolioData();
  const [data, setData] = useState<ContactData>(contact);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(contact);
  }, [contact]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContact(data);
    } finally {
      setSaving(false);
    }
  };

  const addLink = () =>
    setData({
      ...data,
      additionalLinks: [...(data.additionalLinks || []), { label: '', url: '' }],
    });

  const removeLink = (i: number) =>
    setData({
      ...data,
      additionalLinks: (data.additionalLinks || []).filter((_, idx) => idx !== i),
    });

  const updateLink = (i: number, field: string, val: string) => {
    const copy = [...(data.additionalLinks || [])];
    copy[i] = { ...copy[i], [field]: val };
    setData({ ...data, additionalLinks: copy });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact & Social Links</h1>
          <p className="text-gray-400 text-sm mt-1">
            Update your primary contact details and social media profile links.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Primary Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <h2 className="text-base font-bold text-white">Primary Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <Mail size={14} className="text-accent-blue" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <Phone size={14} className="text-accent-cyan" />
              <span>Phone Number</span>
            </label>
            <input
              type="text"
              value={data.phone || ''}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <MapPin size={14} className="text-accent-indigo" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Social Profiles */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <h2 className="text-base font-bold text-white">Social Profiles</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <LinkIcon size={14} className="text-accent-cyan" />
              <span>LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              value={data.linkedin || ''}
              onChange={(e) => setData({ ...data, linkedin: e.target.value })}
              placeholder="https://www.linkedin.com/in/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <LinkIcon size={14} className="text-accent-indigo" />
              <span>GitHub Profile URL</span>
            </label>
            <input
              type="url"
              value={data.github || ''}
              onChange={(e) => setData({ ...data, github: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              <Globe size={14} className="text-accent-blue" />
              <span>Portfolio URL</span>
            </label>
            <input
              type="url"
              value={data.portfolio || ''}
              onChange={(e) => setData({ ...data, portfolio: e.target.value })}
              placeholder="https://yourportfolio.vercel.app"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Additional Links */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Additional Custom Links</h2>
          <button
            type="button"
            onClick={addLink}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Link</span>
          </button>
        </div>
        {(data.additionalLinks || []).length === 0 ? (
          <p className="text-gray-500 text-xs italic py-2">No additional custom links added yet</p>
        ) : (
          (data.additionalLinks || []).map((link, i) => (
            <div key={i} className="flex items-center space-x-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(i, 'label', e.target.value)}
                placeholder="Label (e.g. Twitter / X, Medium, LeetCode)"
                className="flex-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-[2] px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </motion.div>
    </form>
  );
}
