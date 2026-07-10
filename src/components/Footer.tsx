import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="py-12 border-t border-white/5 bg-charcoal-dark/60 text-gray-500 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-accent-cyan flex items-center justify-center font-bold text-xs text-white">
            RA
          </div>
          <span className="font-semibold text-sm tracking-wide text-gray-300">
            Ram Ashish Yadav
          </span>
        </div>

        {/* Middle: Copyright */}
        <div className="text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Ram Ashish Yadav. All rights reserved.
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={handleScrollToTop}
          className="p-2.5 rounded-full border border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
          title="Scroll to Top"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
