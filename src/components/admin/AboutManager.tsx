import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Loader } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { AboutData } from '../../types/portfolio';

export default function AboutManager() {
  const { about, updateAbout } = usePortfolioData();
  const [data, setData] = useState<AboutData>(about);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(about);
  }, [about]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAbout(data);
    } finally {
      setSaving(false);
    }
  };

  const addDescription = () =>
    setData({ ...data, description: [...(data.description || []), ''] });

  const removeDescription = (i: number) =>
    setData({
      ...data,
      description: (data.description || []).filter((_, idx) => idx !== i),
    });

  const updateDescription = (i: number, val: string) => {
    const copy = [...(data.description || [])];
    copy[i] = val;
    setData({ ...data, description: copy });
  };

  const addHighlight = () =>
    setData({
      ...data,
      highlights: [
        ...(data.highlights || []),
        { icon: 'Award', title: '', desc: '' },
      ],
    });

  const removeHighlight = (i: number) =>
    setData({
      ...data,
      highlights: (data.highlights || []).filter((_, idx) => idx !== i),
    });

  const updateHighlight = (i: number, field: string, val: string) => {
    const copy = [...(data.highlights || [])];
    copy[i] = { ...copy[i], [field]: val };
    setData({ ...data, highlights: copy });
  };

  const addStat = () =>
    setData({ ...data, stats: [...(data.stats || []), { value: '', label: '' }] });

  const removeStat = (i: number) =>
    setData({
      ...data,
      stats: (data.stats || []).filter((_, idx) => idx !== i),
    });

  const updateStat = (i: number, field: string, val: string) => {
    const copy = [...(data.stats || [])];
    copy[i] = { ...copy[i], [field]: val };
    setData({ ...data, stats: copy });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">About Me Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Update your professional introduction, narrative bio, and experience highlights.
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

      {/* Basic Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <h2 className="text-base font-bold text-white">Titles & Heading</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Professional Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Section Subtitle
            </label>
            <input
              type="text"
              value={data.subtitle || ''}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Description Paragraphs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Narrative Bio Paragraphs</h2>
          <button
            type="button"
            onClick={addDescription}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Paragraph</span>
          </button>
        </div>
        {(data.description || []).map((para, i) => (
          <div key={i} className="flex space-x-2">
            <textarea
              rows={3}
              value={para}
              onChange={(e) => updateDescription(i, e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
              placeholder={`Paragraph ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeDescription(i)}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors self-start cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Experience Highlight Cards</h2>
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Card</span>
          </button>
        </div>
        <div className="space-y-3">
          {(data.highlights || []).map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Highlight #{i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="p-1 rounded text-gray-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={h.title}
                  onChange={(e) => updateHighlight(i, 'title', e.target.value)}
                  placeholder="Card Title (e.g. Academic Foundation)"
                  className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors font-medium"
                />
                <input
                  type="text"
                  value={h.icon}
                  onChange={(e) => updateHighlight(i, 'icon', e.target.value)}
                  placeholder="Icon (BookOpen, Cpu, Award, Star)"
                  className="px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <textarea
                rows={2}
                value={h.desc}
                onChange={(e) => updateHighlight(i, 'desc', e.target.value)}
                placeholder="Card description text..."
                className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Degree & Specialisation Badges</h2>
          <button
            type="button"
            onClick={addStat}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Badge</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.stats || []).map((s, i) => (
            <div key={i} className="flex items-center space-x-2 p-3.5 rounded-xl bg-gray-900/60 border border-gray-700/40">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                  placeholder="Badge text (e.g. B.E., MERN)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  placeholder="Sub-label (e.g. Computer Science)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </form>
  );
}
