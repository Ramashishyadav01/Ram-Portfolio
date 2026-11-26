import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Trash2, Eye, Download, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export default function ResumeManager() {
  const { resumeUrl, resumeName, isCustomResume, replaceResume, deleteResume } = usePortfolioData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error('Only PDF, DOC, or DOCX files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await replaceResume(selectedFile);
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      toast.error('Failed to replace resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume();
      setShowDeleteModal(false);
    } catch {
      toast.error('Delete failed.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resume Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload and replace your resume. Every Resume button across your portfolio updates automatically.
        </p>
      </div>

      {/* Current Active Resume Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Current Active Resume</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${
              isCustomResume
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>{isCustomResume ? 'Custom Uploaded' : 'Default Preset'}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-900/60 border border-gray-700/40">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <FileText size={28} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{resumeName}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Connected to all public portfolio download & preview buttons
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold transition-colors"
              title="Preview in new tab"
            >
              <Eye size={14} />
              <span>Preview</span>
            </a>
            <a
              href={resumeUrl}
              download={resumeName}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              title="Download file"
            >
              <Download size={14} />
              <span>Download</span>
            </a>
            {isCustomResume && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                title="Delete uploaded resume & revert to default"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upload & Replace Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gray-800/40 border border-gray-700/50 p-6 shadow-xl"
      >
        <h2 className="text-base font-bold text-white mb-2">Upload New Resume</h2>
        <p className="text-gray-400 text-xs mb-4">
          Select a new resume file from your entire computer. Supported formats: <strong>PDF, DOC, DOCX</strong> (max 5 MB).
        </p>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-700 hover:border-blue-500/60 rounded-2xl p-8 text-center transition-all cursor-pointer bg-gray-900/30 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-800 group-hover:bg-blue-500/10 border border-gray-700 group-hover:border-blue-500/30 flex items-center justify-center mx-auto mb-3 transition-colors text-gray-400 group-hover:text-blue-400">
            <Upload size={24} />
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <p className="text-blue-400 font-semibold text-sm">{selectedFile.name}</p>
              <p className="text-gray-500 text-xs">{formatSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-gray-300 text-sm font-medium">Click to browse your computer files</p>
              <p className="text-gray-500 text-xs">PDF, DOC, DOCX up to 5 MB</p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {selectedFile && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => {
                setSelectedFile(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-sm font-semibold disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              {uploading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Replacing Resume...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Confirm & Replace Portfolio Resume</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-rose-500/20 text-rose-400">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Resume?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              This will remove the uploaded resume and revert all Resume buttons on your portfolio back to the original default resume.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Delete & Revert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
