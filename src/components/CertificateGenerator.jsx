import { useRef, useState } from 'react';
import { Download, Award, Loader2, X, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PHASES } from '../data/roadmap';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function CertificateGenerator({ isCompleted }) {
  const { currentUser } = useAuth();
  const certificateRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleDownload = async (isPreview = false) => {
    if (!certificateRef.current) return;
    
    try {
      setIsGenerating(true);
      setErrorMsg(null);
      
      const el = certificateRef.current;
      
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: true,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas generated with 0 dimensions.");
      }
      
      if (isPreview) {
        setPreviewImage(imgData);
      } else {
        // A4 landscape dimensions
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save('Data-Scientist-Path-Certificate.pdf');
      }
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      setErrorMsg(error.message || String(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const name = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anisakhatun Bukhari';
  const displayName = name;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Generate unique verification hash
  const getVerificationId = () => {
    const rawString = displayName + date;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      hash = (hash << 5) - hash + rawString.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().slice(0, 6).padStart(6, 'F');
    return `CERT-${hex}`;
  };

  const certId = getVerificationId();

  return (
    <>
      {!isCompleted ? (
        <div className="bg-bg-raise border border-border-line rounded-2xl p-6 text-center mt-8 relative">
          <Award size={32} className="mx-auto mb-3 text-text-dim" />
          <h3 className="text-lg font-bold font-display text-text-main">Certificate of Completion</h3>
          <p className="text-sm text-text-dim mt-1 mb-4">Complete all phases and quizzes to unlock your certificate.</p>
          <button 
            onClick={() => handleDownload(true)}
            disabled={isGenerating}
            className="text-xs font-mono font-bold tracking-wider uppercase text-text-main border border-border-strong hover:bg-surface-hover px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Eye size={14} />
                Preview Sample
              </>
            )}
          </button>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 text-left overflow-auto max-h-32">
              <span className="font-bold block mb-1">Error generating PDF:</span>
              <code className="whitespace-pre-wrap font-mono">{errorMsg}</code>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-phase-gold/10 border border-phase-gold/30 rounded-2xl p-8 text-center mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-phase-gold/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-phase-amber/20 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          
          <Award size={48} className="mx-auto mb-4 text-phase-gold relative z-10" />
          <h3 className="text-2xl font-bold font-display text-text-main relative z-10 mb-2">Congratulations!</h3>
          <p className="text-text-dim mb-6 relative z-10">You have completed the entire Data Scientist Path.</p>
          
          <div className="flex items-center justify-center gap-4 relative z-10">
            <button 
              onClick={() => handleDownload(true)}
              disabled={isGenerating}
              className="bg-surface text-text-main font-bold font-mono px-6 py-3 rounded-xl shadow border border-border-line hover:border-border-strong transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Eye size={18} />
              Preview
            </button>
            <button 
              onClick={() => handleDownload(false)}
              disabled={isGenerating}
              className="bg-gradient-to-r from-phase-gold to-phase-amber text-white font-bold font-mono px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download
                </>
              )}
            </button>
          </div>
          
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 text-left overflow-auto max-h-32 relative z-10">
              <span className="font-bold block mb-1">Error generating PDF:</span>
              <code className="whitespace-pre-wrap font-mono">{errorMsg}</code>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-app-bg/90 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full flex flex-col items-center animate-slide-up" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-text-faint hover:text-text-main bg-surface p-2 rounded-full shadow-lg transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <X size={24} />
            </button>
            <img src={previewImage} alt="Certificate Preview" className="w-full h-auto rounded-xl shadow-2xl border border-border-line" />
            <div className="mt-6 text-text-dim text-sm bg-surface px-4 py-2 rounded-full border border-border-line">
              This is a visual preview of your certificate.
            </div>
          </div>
        </div>
      )}

      {/* Off-screen Premium Certificate Template for html2canvas */}
      <div 
        ref={certificateRef}
        style={{ 
          position: 'absolute', 
          top: '-9999px', 
          left: '-9999px', 
          zIndex: -100, 
          backgroundColor: '#fdfbf7', // Elegant cream background
          color: '#1e293b', 
          overflow: 'hidden' 
        }}
        className="w-[1123px] h-[794px] p-16 font-sans relative"
      >
        {/* Harvard/edX elegant double borders */}
        <div className="absolute inset-6 border-[3px] pointer-events-none" style={{ borderColor: '#854d0e' }}></div> {/* Gold outer border */}
        <div className="absolute inset-8 border pointer-events-none" style={{ borderColor: 'rgba(133, 77, 14, 0.3)' }}></div>
        <div className="absolute inset-10 border-[2px] pointer-events-none" style={{ borderColor: '#854d0e' }}></div> {/* Gold inner border */}

        <div className="flex flex-col items-center justify-between h-full text-center relative z-10 px-16 py-8">
          {/* Header Organization / Institution Logo Block */}
          <div className="space-y-2">
            <div 
              className="text-xs uppercase tracking-[0.3em] font-extrabold font-sans"
              style={{ color: '#64748b' }}
            >
              DATA SCIENTIST PATHWAY ACADEMY
            </div>
            <h3 
              className="text-xl font-serif tracking-wider font-semibold"
              style={{ color: '#1e293b' }}
            >
              Certificate of Completion
            </h3>
            <div className="w-16 h-0.5 mx-auto my-2" style={{ backgroundColor: 'rgba(120, 53, 4, 0.45)' }}></div>
          </div>

          {/* Certificate Main Text */}
          <div className="space-y-5 my-auto">
            <p 
              className="text-xs uppercase tracking-[0.2em] font-bold"
              style={{ color: '#854d0e' }}
            >
              This is to certify that
            </p>
            
            <h2 
              className="text-5xl font-serif font-bold my-4 tracking-tight leading-none italic"
              style={{ color: '#0f172a' }}
            >
              {displayName}
            </h2>
            
            <p 
              className="text-sm max-w-2xl mx-auto leading-relaxed font-serif"
              style={{ color: '#64748b' }}
            >
              has successfully completed all requirements, projects, and examinations for the curriculum of
            </p>

            <h1 
              className="text-3xl font-sans font-extrabold uppercase tracking-wide"
              style={{ color: '#1e293b' }}
            >
              Data Scientist & Machine Learning Specialist
            </h1>

            <p 
              className="text-xs max-w-xl mx-auto leading-normal"
              style={{ color: '#94a3b8' }}
            >
              A comprehensive pathway demonstrating exceptional command over Python, SQL Analytics, 
              Advanced Statistical Modeling, Deep Neural Architectures, and MLOps deployment.
            </p>
          </div>

          {/* Signatures & Verification Details Footer */}
          <div 
            className="w-full grid grid-cols-3 items-end pt-8 mt-auto"
            style={{ borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}
          >
            {/* Signature Left */}
            <div className="text-center">
              <div 
                className="font-serif italic text-lg mb-1 max-w-[180px] mx-auto pb-1.5"
                style={{ borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}
              >
                Anisakhatun Bukhari
              </div>
              <div 
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#334155' }}
              >
                Anisakhatun Bukhari
              </div>
              <div 
                className="text-[8px] uppercase tracking-wider mt-0.5"
                style={{ color: '#94a3b8' }}
              >
                Head of Data Science Curriculum
              </div>
            </div>

            {/* Middle Badge / Verification Seal */}
            <div className="flex flex-col items-center justify-center">
              {/* Golden Star/Badge Seal */}
              <div 
                className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center relative mb-2 shadow-inner"
                style={{ 
                  borderColor: 'rgba(180, 83, 9, 0.4)',
                  backgroundColor: 'rgba(254, 243, 199, 0.5)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center border"
                  style={{ 
                    borderColor: 'rgba(180, 83, 9, 0.2)',
                    backgroundColor: 'rgba(253, 224, 71, 0.1)'
                  }}
                >
                  <Award size={24} style={{ color: '#b45309' }} />
                </div>
                {/* Ribbon tails */}
                <div 
                  className="absolute -bottom-3 left-3 w-3 h-6 transform rotate-12 -z-10 origin-top"
                  style={{ backgroundColor: 'rgba(180, 83, 9, 0.8)' }}
                ></div>
                <div 
                  className="absolute -bottom-3 right-3 w-3 h-6 transform -rotate-12 -z-10 origin-top"
                  style={{ backgroundColor: 'rgba(180, 83, 9, 0.8)' }}
                ></div>
              </div>

              {/* Digital Signature */}
              <div className="text-center mb-2 mt-1">
                <div 
                  className="font-mono text-xs mb-0.5 border-b border-border-line px-2 pb-0.5 italic"
                  style={{ color: '#1e293b' }}
                >
                  Bukhari A.A.
                </div>
                <div className="text-[7px] uppercase tracking-wider font-bold" style={{ color: '#94a3b8' }}>
                  Digital Signature
                </div>
              </div>

              <div 
                className="text-[9px] font-mono font-bold uppercase tracking-wider"
                style={{ color: '#64748b' }}
              >
                ID: {certId}
              </div>
              <a 
                href={`/verify?id=${certId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[8px] font-mono hover:underline mt-0.5 uppercase tracking-wide"
                style={{ color: '#854d0e' }}
              >
                Verify Authenticity ↗
              </a>
            </div>

            {/* Signature Right */}
            <div className="text-center">
              <div 
                className="font-serif italic text-lg mb-1 max-w-[180px] mx-auto pb-1.5 font-medium"
                style={{ borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}
              >
                Anisakhatun Bukhari
              </div>
              <div 
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#334155' }}
              >
                Anisakhatun Bukhari
              </div>
              <div 
                className="text-[8px] uppercase tracking-wider mt-0.5"
                style={{ color: '#94a3b8' }}
              >
                Lead Academy Instructor
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
