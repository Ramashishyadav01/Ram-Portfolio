import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, AlertCircle, Eye, EyeOff, FolderKanban, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Github } from '../icons';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import type { ProjectData } from '../../types/portfolio';

const emptyProject = {
  title: '',
  description: [''],
  tech: '',
  github: '',
  demo: '',
  status: 'published' as 'published' | 'draft',
};

export default function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = usePortfolioData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingProject(null);
    setForm(emptyProject);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (project: ProjectData) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description && project.description.length ? project.description : [''],
      tech: project.tech ? project.tech.join(', ') : '',
      github: project.github || '',
      demo: project.demo || '',
      status: (project.status as 'published' | 'draft') || 'published',
    });
    setImagePreview(project.image || null);
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be under 10 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    try {
      const techArray = form.tech
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const cleanDescription = form.description.filter((d) => d.trim());

      const payload = {
        title: form.title.trim(),
        description: cleanDescription.length ? cleanDescription : [form.title],
        tech: techArray,
        image: imagePreview || '',
        github: form.github.trim(),
        demo: form.demo.trim(),
        status: form.status,
        order: editingProject ? editingProject.order : projects.length,
      };

      if (editingProject) {
        await updateProject(editingProject._id, payload);
      } else {
        await addProject(payload);
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteProject(deleteId);
    setDeleteId(null);
  };

  const toggleStatus = async (project: ProjectData) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    await updateProject(project._id, { status: newStatus });
  };

  const addDescBullet = () => setForm({ ...form, description: [...form.description, ''] });
  const removeDescBullet = (i: number) =>
    setForm({ ...form, description: form.description.filter((_, idx) => idx !== i) });
  const updateDescBullet = (i: number, val: string) => {
    const copy = [...form.description];
    copy[i] = val;
    setForm({ ...form, description: copy });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your featured projects. Published projects appear live on your public portfolio.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gray-800/40 border border-gray-700/50 overflow-hidden flex flex-col justify-between shadow-lg group hover:border-gray-600 transition-all"
          >
            <div>
              {/* Project Image Header */}
              <div className="h-44 bg-gray-900 relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <ImageIcon size={32} />
                    <span className="text-xs mt-1">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-md ${
                      project.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md'
                    }`}
                  >
                    {project.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-white font-bold text-base leading-tight">{project.title}</h3>

                {/* Bullet Points */}
                <ul className="space-y-1.5 text-xs text-gray-400">
                  {project.description.slice(0, 2).map((b, i) => (
                    <li key={i} className="line-clamp-2">
                      • {b}
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-lg bg-gray-900 border border-gray-700/50 text-[10px] font-medium text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-gray-700/40 bg-gray-900/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                    title="View Code"
                  >
                    <Github size={15} />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-accent-cyan hover:bg-gray-700/50 transition-colors"
                    title="Live Demo"
                  >
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => toggleStatus(project)}
                  className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    project.status === 'published'
                      ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10'
                      : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                  title={project.status === 'published' ? 'Set as Draft' : 'Publish'}
                >
                  {project.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => openEdit(project)}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(project._id)}
                  className="p-2 rounded-xl bg-gray-800 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 bg-gray-800/20 rounded-2xl border border-gray-700/30">
          <FolderKanban size={48} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">No projects yet</p>
          <p className="text-gray-600 text-xs mt-1">Click "Add Project" to create your first portfolio project.</p>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. E-Shop (E-Commerce Platform)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Description Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Description Bullets
                    </label>
                    <button
                      type="button"
                      onClick={addDescBullet}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                    >
                      + Add Bullet
                    </button>
                  </div>
                  {form.description.map((bullet, idx) => (
                    <div key={idx} className="flex space-x-2 mb-2">
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateDescBullet(idx, e.target.value)}
                        placeholder={`Bullet point ${idx + 1}...`}
                        className="flex-1 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                      {form.description.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDescBullet(idx)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 self-start cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.tech}
                    onChange={(e) => setForm({ ...form, tech: e.target.value })}
                    placeholder="React.js, Node.js, MongoDB, Tailwind CSS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Project Screenshot / Thumbnail
                  </label>
                  {imagePreview && (
                    <div className="mb-2 rounded-xl overflow-hidden h-36 bg-gray-900 border border-gray-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ImageIcon size={14} />
                    <span>Choose Image File</span>
                  </button>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={form.demo}
                      onChange={(e) => setForm({ ...form, demo: e.target.value })}
                      placeholder="https://your-demo.vercel.app"
                      className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="published">Published (Visible on Portfolio)</option>
                    <option value="draft">Draft (Hidden from Visitors)</option>
                  </select>
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-rose-500/20 text-rose-400">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Project?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              This project will be removed from your portfolio immediately.
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
