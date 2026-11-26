import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Building,
} from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { ExperienceData } from '../../types/portfolio';

const emptyExperience = {
  role: '',
  company: '',
  location: '',
  period: '',
  description: '',
  achievements: [''],
  skills: '',
};

export default function ExperienceManager() {
  const { experiences, addExperience, updateExperience, deleteExperience } = usePortfolioData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyExperience);
  const [saving, setSaving] = useState(false);

  const sortedExperiences = [...experiences].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditingExp(null);
    setForm(emptyExperience);
    setModalOpen(true);
  };

  const openEdit = (exp: ExperienceData) => {
    setEditingExp(exp);
    setForm({
      role: exp.role,
      company: exp.company,
      location: exp.location || '',
      period: exp.period || '',
      description: exp.description || '',
      achievements: exp.achievements && exp.achievements.length > 0 ? exp.achievements : [''],
      skills: exp.skills ? exp.skills.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return;

    setSaving(true);
    try {
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const cleanAchievements = form.achievements
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        role: form.role.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        period: form.period.trim(),
        description: form.description.trim(),
        achievements: cleanAchievements.length > 0 ? cleanAchievements : [form.role.trim()],
        skills: skillsArray,
        order: editingExp ? editingExp.order : experiences.length,
      };

      if (editingExp) {
        await updateExperience(editingExp._id, payload);
      } else {
        await addExperience(payload);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteExperience(deleteId);
    setDeleteId(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedExperiences.length) return;

    const currentExp = sortedExperiences[index];
    const targetExp = sortedExperiences[targetIndex];

    const currentOrder = currentExp.order;
    const targetOrder = targetExp.order;

    await updateExperience(currentExp._id, { order: targetOrder });
    await updateExperience(targetExp._id, { order: currentOrder });
  };

  const addAchievementBullet = () => {
    setForm({ ...form, achievements: [...form.achievements, ''] });
  };

  const removeAchievementBullet = (index: number) => {
    setForm({
      ...form,
      achievements: form.achievements.filter((_, i) => i !== index),
    });
  };

  const updateAchievementBullet = (index: number, value: string) => {
    const updated = [...form.achievements];
    updated[index] = value;
    setForm({ ...form, achievements: updated });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Experience Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your full-time, part-time, internship, and contract work experiences.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      {sortedExperiences.length === 0 ? (
        <div className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Briefcase size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No Experience Entries Yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Add your professional roles, internships, or freelance experience to showcase on your portfolio.
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} />
            <span>Add Your First Experience</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedExperiences.map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 shadow-lg group hover:border-blue-500/30 transition-all"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-gray-700/50">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
                        <Building size={14} />
                        <span>{exp.company}</span>
                      </span>
                      {exp.period && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
                            <Calendar size={13} className="text-blue-400" />
                            <span>{exp.period}</span>
                          </span>
                        </>
                      )}
                      {exp.location && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <MapPin size={13} className="text-gray-500" />
                            <span>{exp.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex items-center space-x-1.5 self-end md:self-start">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sortedExperiences.length - 1}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-gray-800 disabled:hover:text-gray-400 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    onClick={() => openEdit(exp)}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Experience"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(exp._id)}
                    className="p-2 rounded-xl bg-gray-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Experience"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Description */}
              {exp.description && (
                <div className="pt-4 text-sm text-gray-300 leading-relaxed font-normal">
                  {exp.description}
                </div>
              )}

              {/* Achievements */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="pt-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Key Achievements
                  </p>
                  <ul className="space-y-2">
                    {exp.achievements.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2.5 text-xs text-gray-300 leading-relaxed">
                        <CheckCircle2 size={14} className="text-blue-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Tags */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-gray-700/40">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700/50 text-[11px] font-medium text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#111827] border border-gray-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <Briefcase size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {editingExp ? 'Edit Work Experience' : 'Add Work Experience'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form id="experience-form" onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Role / Job Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jr. Full Stack Developer (Intern)"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Company Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global Tech Reach"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Period / Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nov 2025 – Jan 2026"
                      value={form.period}
                      onChange={(e) => setForm({ ...form, period: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai UAE (Remote) or Noida, India"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Summary / Overview
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the position and responsibilities..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Achievements dynamic list */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-300">
                      Key Achievements / Responsibilities
                    </label>
                    <button
                      type="button"
                      onClick={addAchievementBullet}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
                    >
                      <Plus size={14} />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={`Achievement #${idx + 1}...`}
                          value={ach}
                          onChange={(e) => updateAchievementBullet(idx, e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        {form.achievements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAchievementBullet(idx)}
                            className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                            title="Remove bullet"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Technologies & Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React.js, Node.js, Express.js, MongoDB, Tailwind CSS"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Separate tech tools with commas. Each one will be rendered as a skill badge.
                  </p>
                </div>
              </form>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="experience-form"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  {saving ? 'Saving...' : editingExp ? 'Update Experience' : 'Add Experience'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Experience?</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Are you sure you want to delete this experience record? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-rose-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
