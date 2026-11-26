import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertCircle, Code, Layout, Server, Database, Settings, ShieldCheck, Check } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { SkillItem } from '../../types/portfolio';

const CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Tools & DevOps',
  'Methodologies',
] as const;

const categoryIcons: Record<string, React.ReactNode> = {
  Languages: <Code size={18} className="text-blue-400" />,
  Frontend: <Layout size={18} className="text-cyan-400" />,
  Backend: <Server size={18} className="text-indigo-400" />,
  Databases: <Database size={18} className="text-purple-400" />,
  'Tools & DevOps': <Settings size={18} className="text-pink-400" />,
  Methodologies: <ShieldCheck size={18} className="text-blue-400" />,
};

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export default function SkillsManager() {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolioData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: CATEGORIES[0] as string,
    name: '',
    level: 'Intermediate',
  });
  const [saving, setSaving] = useState(false);

  const grouped = CATEGORIES.reduce<Record<string, SkillItem[]>>((acc, cat) => {
    acc[cat] = skills
      .filter((s) => s.category.trim().toLowerCase() === cat.toLowerCase())
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<string, SkillItem[]>);

  const openAdd = (defaultCat?: string) => {
    setEditingSkill(null);
    setForm({
      category: defaultCat || CATEGORIES[0],
      name: '',
      level: 'Intermediate',
    });
    setModalOpen(true);
  };

  const openEdit = (skill: SkillItem) => {
    setEditingSkill(skill);
    setForm({
      category: skill.category,
      name: skill.name,
      level: skill.level || 'Intermediate',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      if (editingSkill) {
        await updateSkill(editingSkill._id, {
          category: form.category,
          name: form.name.trim(),
          level: form.level,
        });
      } else {
        await addSkill(form.category, form.name.trim(), form.level);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteSkill(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Skills Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your technical skills manually. Changes immediately reflect on your public portfolio.
          </p>
        </div>
        <button
          onClick={() => openAdd()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const catSkills = grouped[cat] || [];
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-gray-900 border border-gray-700/50">
                      {categoryIcons[cat]}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">{cat}</h2>
                      <span className="text-xs text-gray-500">
                        {catSkills.length} skill{catSkills.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openAdd(cat)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors cursor-pointer"
                    title={`Add skill to ${cat}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {catSkills.length === 0 ? (
                  <p className="text-gray-500 text-xs italic py-4">No skills in this category yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {catSkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-900/60 border border-gray-700/40 hover:border-blue-500/40 transition-all text-xs"
                      >
                        <span className="text-gray-200 font-medium">{skill.name}</span>
                        {skill.level && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-normal">
                            {skill.level}
                          </span>
                        )}
                        <button
                          onClick={() => openEdit(skill)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-blue-400 transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => setDeleteId(skill._id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit Skill Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Next.js, Redux, Docker"
                    required
                    autoFocus
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Proficiency Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm({ ...form, level })}
                        className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          form.level === level
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {form.level === level && <Check size={12} />}
                        <span>{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingSkill ? 'Update' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-rose-500/20">
                <AlertCircle className="text-rose-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Delete Skill?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              This skill will be removed from your portfolio immediately.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
