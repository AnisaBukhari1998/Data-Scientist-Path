import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

export function PdfViewerModal({ pdf, onClose }) {
  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pdf) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a090f]/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full h-[90vh] max-w-6xl bg-surface border border-border-line rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-line bg-bg-raise">
          <div className="flex flex-col min-w-0 pr-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-phase-teal mb-0.5">App PDF Viewer</span>
            <h3 className="font-bold text-text-main text-[15px] truncate font-display">{pdf.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Fallback external link */}
            <a 
              href={pdf.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-faint hover:text-text-main hover:bg-surface transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={18} />
            </a>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-text-faint hover:text-phase-brick hover:bg-phase-brick/10 transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full h-full bg-[#1b1924]">
          <iframe 
            src={pdf.url} 
            className="w-full h-full border-none"
            title={pdf.title}
          />
        </div>
      </div>
    </div>
  );
}
