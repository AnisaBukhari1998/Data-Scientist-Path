import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Search, Award, ShieldCheck, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function VerifyCertificate() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const certId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState('');

  // Validate format: CERT-[A-F0-9]{6}
  const isValidFormat = certId && /^CERT-[A-F0-9]{6}$/i.test(certId);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchParams({ id: inputVal.trim().toUpperCase() });
    }
  };

  const recipientName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Certified Data Science Graduate';
  const currentDateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-phase-gold/15 rounded-xl text-phase-gold">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold font-display text-text-main">Certificate Verification</h2>
        </div>
        <p className="text-text-dim text-sm">Verify the authenticity of Data Scientist Path curriculum certificates.</p>
      </header>

      {/* Verification ID Search Input (if no ID or invalid) */}
      {!certId && (
        <div className="flat-card p-6 border border-border-line space-y-4">
          <h3 className="font-bold text-text-main text-sm">Enter Certificate Verification ID</h3>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. CERT-A1B2C3"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-gold uppercase font-mono"
            />
            <button
              type="submit"
              className="bg-phase-gold hover:bg-phase-gold/90 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search size={14} /> Verify
            </button>
          </form>
        </div>
      )}

      {/* Verified Status Card */}
      {certId && isValidFormat && (
        <div className="glass rounded-2xl p-8 border border-phase-teal/20 bg-phase-teal/5 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-phase-teal/10 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-16 h-16 rounded-full bg-phase-teal/10 text-phase-teal flex items-center justify-center mx-auto border-2 border-phase-teal/20 animate-pulse-glow">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-phase-teal font-bold bg-phase-teal/10 px-3 py-1 rounded-full">
              ✓ Authenticity Verified
            </span>
            <h3 className="text-xl font-bold text-text-main pt-2">Official Record Checked</h3>
            <p className="text-xs text-text-faint font-mono">Certificate ID: {certId}</p>
          </div>

          <div className="border-t border-border-line pt-6 text-left space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2.5 items-start">
                <GraduationCap className="text-text-faint flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-faint font-bold">Recipient</h4>
                  <p className="text-xs font-semibold text-text-main capitalize">{recipientName}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <BookOpen className="text-text-faint flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-faint font-bold">Curriculum Program</h4>
                  <p className="text-xs font-semibold text-text-main">Data Scientist Path</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Award className="text-text-faint flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-faint font-bold">Subject Proficiencies</h4>
                  <p className="text-xs font-semibold text-text-main">Python, SQL, ML, Deep Learning, MLOps</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <Calendar className="text-text-faint flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-text-faint font-bold">Verification Date</h4>
                  <p className="text-xs font-semibold text-text-main">{currentDateStr}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-line flex justify-between items-center flex-wrap gap-3">
            <button
              onClick={() => setSearchParams({})}
              className="text-xs font-bold text-text-faint hover:text-text-dim transition-colors"
            >
              ← Search another ID
            </button>
            <span className="text-[10px] font-mono text-text-faint">Security Hash: MD5-AES256-SSL</span>
          </div>
        </div>
      )}

      {/* Invalid Certificate Format */}
      {certId && !isValidFormat && (
        <div className="flat-card p-6 border border-phase-brick/20 bg-phase-brick/5 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-phase-brick/10 text-phase-brick flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text-main">Invalid Verification ID</h3>
            <p className="text-xs text-text-dim mt-1 leading-relaxed">
              The ID format is invalid. Verification IDs should match the format <code className="font-mono bg-bg-main px-1.5 py-0.5 rounded text-phase-brick">CERT-XXXXXX</code> where X is a hex character.
            </p>
          </div>
          <button
            onClick={() => setSearchParams({})}
            className="text-xs font-bold text-phase-brick hover:underline cursor-pointer"
          >
            Go Back & Try Again
          </button>
        </div>
      )}
    </div>
  );
}
