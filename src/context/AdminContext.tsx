import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode, type ChangeEvent } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  logout: () => void;
  resumeUrl: string;
  resumeName: string;
  isCustomResume: boolean;
  triggerResumeUpload: () => void;
  resetResume: () => void;
}

// ⚠️ CHANGE THIS to your own secret password
const ADMIN_PASSWORD = 'ram@2026';

const RESUME_STORAGE_KEY = 'portfolio_resume_data';
const RESUME_NAME_KEY = 'portfolio_resume_name';
const DEFAULT_RESUME_URL = '/Ram_Ashish_Yadav_Resume.pdf';
const DEFAULT_RESUME_NAME = 'Ram_Ashish_Yadav_Resume.pdf';

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

/** Convert a base64 data-URL to a same-origin blob URL (safe for target="_blank") */
function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/pdf';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);
  const [resumeName, setResumeName] = useState(DEFAULT_RESUME_NAME);
  const [isCustomResume, setIsCustomResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  /* ── Initialise admin state + load stored resume ── */
  useEffect(() => {
    // Restore admin session
    if (sessionStorage.getItem('portfolio_admin') === 'true') {
      setIsAdmin(true);
    }

    // Handle ?admin URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) {
      const pwd = prompt('🔐 Enter admin password:');
      if (pwd === ADMIN_PASSWORD) {
        setIsAdmin(true);
        sessionStorage.setItem('portfolio_admin', 'true');
      } else if (pwd !== null) {
        alert('❌ Incorrect password.');
      }
      // Remove ?admin from URL without reload
      params.delete('admin');
      const cleanUrl = params.toString()
        ? `${window.location.pathname}?${params}`
        : window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    // Load custom resume from localStorage
    const storedData = localStorage.getItem(RESUME_STORAGE_KEY);
    const storedName = localStorage.getItem(RESUME_NAME_KEY);
    if (storedData) {
      try {
        const blobUrl = dataUrlToBlobUrl(storedData);
        blobUrlRef.current = blobUrl;
        setResumeUrl(blobUrl);
        setResumeName(storedName || DEFAULT_RESUME_NAME);
        setIsCustomResume(true);
      } catch {
        localStorage.removeItem(RESUME_STORAGE_KEY);
        localStorage.removeItem(RESUME_NAME_KEY);
      }
    }

    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  /* ── Admin actions ── */
  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('portfolio_admin');
  }, []);

  const processUpload = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      alert('❌ Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ File must be under 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, dataUrl);
        localStorage.setItem(RESUME_NAME_KEY, file.name);

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const blobUrl = dataUrlToBlobUrl(dataUrl);
        blobUrlRef.current = blobUrl;

        setResumeUrl(blobUrl);
        setResumeName(file.name);
        setIsCustomResume(true);
        alert('✅ Resume replaced successfully!');
      } catch {
        alert('❌ File too large for browser storage. Use a smaller PDF (under 5 MB).');
      }
    };
    reader.onerror = () => alert('❌ Failed to read the file.');
    reader.readAsDataURL(file);
  }, []);

  const triggerResumeUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetResume = useCallback(() => {
    localStorage.removeItem(RESUME_STORAGE_KEY);
    localStorage.removeItem(RESUME_NAME_KEY);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setResumeUrl(DEFAULT_RESUME_URL);
    setResumeName(DEFAULT_RESUME_NAME);
    setIsCustomResume(false);
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processUpload(file);
      e.target.value = '';
    },
    [processUpload],
  );

  return (
    <AdminContext.Provider
      value={{ isAdmin, logout, resumeUrl, resumeName, isCustomResume, triggerResumeUpload, resetResume }}
    >
      {children}

      {/* Hidden file input — triggered programmatically by triggerResumeUpload() */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
      />
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
