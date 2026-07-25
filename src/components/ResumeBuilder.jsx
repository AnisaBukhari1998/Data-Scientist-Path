import React, { useState, useRef } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { playClick, playSuccess } from '../utils/audioEngine';
import { Award, Briefcase, Download, FileText, GraduationCap, Link2, Loader2, Sparkles, User, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function ResumeBuilder({ onClose }) {
  const { progress } = useProgress();
  const { currentUser } = useAuth();
  const resumeRef = useRef(null);

  // States for user input experience
  const [summary, setSummary] = useState('Passionate and results-driven Data Scientist. Skilled in building and deploying end-to-end machine learning pipelines, statistical modeling, and data analytics.');
  const [experience, setExperience] = useState([
    { role: 'Data Analyst Intern', company: 'TechSolutions Inc.', duration: '2025 - Present', desc: 'Conducted exploratory data analysis, built dashboards, and optimized SQL search queries increasing efficiency by 15%.' }
  ]);
  const [education, setEducation] = useState([
    { degree: 'B.S. in Computer Science', school: 'State University', year: '2025' }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  // Calculate profile metrics
  const level = progress._level || 1;
  const xp = progress._xp || 0;
  const customCapstone = progress._customCapstone;
  const github = progress._githubUser;

  // Sync connected learning platform lists
  const connectedProfiles = progress._externalProfiles || {};
  const activePlatforms = Object.keys(connectedProfiles)
    .filter(k => connectedProfiles[k])
    .map(k => k.replace('User', '').replace('Email', '').toUpperCase());

  // Count completed tasks
  const getCompletedSummary = () => {
    const list = [];
    ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'].forEach(pKey => {
      const p = progress[pKey] || {};
      ['courses', 'projects'].forEach(cat => {
        if (p[cat] && p[cat].length > 0) {
          list.push(...p[cat]);
        }
      });
    });
    return list.slice(0, 5); // Pick top 5 completions
  };

  const completedModules = getCompletedSummary();

  const handleExportPDF = async () => {
    playClick();
    setIsExporting(true);
    const element = resumeRef.current;
    if (!element) return;

    try {
      // Set options for canvas capture
      const canvas = await html2canvas(element, {
        scale: 2, // Retain high-definition vectors
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to PDF page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Multipage support if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${currentUser?.displayName || 'Data_Scientist'}_Resume.pdf`);
      playSuccess();
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const addExperience = () => {
    playClick();
    setExperience([...experience, { role: 'New Role', company: 'Company Name', duration: 'Years', desc: 'Describe achievements and skills utilized...' }]);
  };

  const removeExperience = (idx) => {
    playClick();
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const handleExpChange = (idx, field, val) => {
    const updated = [...experience];
    updated[idx][field] = val;
    setExperience(updated);
  };

  const addEducation = () => {
    playClick();
    setEducation([...education, { degree: 'Degree Title', school: 'Institution', year: 'Year' }]);
  };

  const removeEducation = (idx) => {
    playClick();
    setEducation(education.filter((_, i) => i !== idx));
  };

  const handleEduChange = (idx, field, val) => {
    const updated = [...education];
    updated[idx][field] = val;
    setEducation(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-surface border border-border-strong rounded-3xl shadow-2xl flex flex-col md:flex-row h-[90vh] overflow-hidden animate-scale-in">
        
        {/* Left Side: Setup Input Workspace */}
        <div className="w-full md:w-2/5 p-6 border-r border-border-line overflow-y-auto custom-scrollbar space-y-6 bg-bg-raise/30">
          <div className="flex justify-between items-center pb-3 border-b border-border-line">
            <div>
              <h3 className="text-lg font-bold font-display text-text-main flex items-center gap-1.5">
                <Sparkles size={18} className="text-phase-violet" />
                Resume Builder
              </h3>
              <p className="text-xs text-text-faint">Construct your data scientist curriculum vitae</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-faint hover:text-text-main hover:bg-bg-raise cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Input: Bio Summary */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-text-main uppercase block">Professional Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-border-line rounded-xl p-3 text-xs text-text-main focus:outline-none focus:border-phase-violet resize-none leading-relaxed"
            />
          </div>

          {/* Input: Experience List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-text-main uppercase">Work Experience</label>
              <button
                onClick={addExperience}
                className="text-[10px] font-mono font-bold text-phase-violet hover:underline cursor-pointer"
              >
                + Add Experience
              </button>
            </div>
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3 bg-surface border border-border-line rounded-xl space-y-2 relative">
                <button
                  onClick={() => removeExperience(idx)}
                  className="absolute top-2 right-2 text-text-faint hover:text-phase-brick"
                >
                  <X size={12} />
                </button>
                <input
                  type="text"
                  placeholder="Role Title"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, 'role', e.target.value)}
                  className="w-full bg-transparent font-bold text-xs text-text-main border-b border-transparent focus:border-phase-violet focus:outline-none py-0.5"
                />
                <div className="flex gap-2 text-[10px]">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-phase-violet focus:outline-none text-text-dim"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => handleExpChange(idx, 'duration', e.target.value)}
                    className="w-20 bg-transparent border-b border-transparent focus:border-phase-violet focus:outline-none text-text-faint text-right font-mono"
                  />
                </div>
                <textarea
                  value={exp.desc}
                  onChange={(e) => handleExpChange(idx, 'desc', e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-[10px] text-text-dim border-none focus:outline-none leading-relaxed resize-none pt-1"
                />
              </div>
            ))}
          </div>

          {/* Input: Education List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-text-main uppercase">Education</label>
              <button
                onClick={addEducation}
                className="text-[10px] font-mono font-bold text-phase-violet hover:underline cursor-pointer"
              >
                + Add Education
              </button>
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="p-3 bg-surface border border-border-line rounded-xl space-y-2 relative">
                <button
                  onClick={() => removeEducation(idx)}
                  className="absolute top-2 right-2 text-text-faint hover:text-phase-brick"
                >
                  <X size={12} />
                </button>
                <input
                  type="text"
                  placeholder="Degree Title"
                  value={edu.degree}
                  onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                  className="w-full bg-transparent font-bold text-xs text-text-main border-b border-transparent focus:border-phase-violet focus:outline-none py-0.5"
                />
                <div className="flex gap-2 text-[10px]">
                  <input
                    type="text"
                    placeholder="School / Institution"
                    value={edu.school}
                    onChange={(e) => handleEduChange(idx, 'school', e.target.value)}
                    className="flex-1 bg-transparent border-b border-transparent focus:border-phase-violet focus:outline-none text-text-dim"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                    className="w-16 bg-transparent border-b border-transparent focus:border-phase-violet focus:outline-none text-text-faint text-right font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Professional CV PDF Preview & Exporter */}
        <div className="flex-1 p-6 flex flex-col h-full bg-[#323639] overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-phase-amber" />
              PDF Live Document Preview
            </span>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-phase-teal hover:bg-phase-teal/85 text-white font-mono font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              <span>{isExporting ? 'Exporting PDF...' : 'Download PDF'}</span>
            </button>
          </div>

          {/* Actual PDF Render Target (Harvard/LaTeX Styling) */}
          <div className="flex-1 overflow-auto bg-[#323639] flex justify-center py-4 rounded-2xl border border-slate-700/50">
            <div 
              ref={resumeRef}
              className="w-[210mm] min-h-[297mm] p-[20mm] bg-white text-slate-800 font-serif leading-relaxed text-xs shadow-xl select-text flex flex-col justify-between"
              style={{ minWidth: '210mm', maxWidth: '210mm', height: 'fit-content' }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-1">
                  <h1 className="text-xl font-bold font-sans tracking-wide text-slate-900 uppercase">
                    {currentUser?.displayName || 'Data Science Candidate'}
                  </h1>
                  <p className="text-[10px] text-slate-500 font-sans font-medium">
                    {currentUser?.email} {github ? `| github.com/${github.username}` : ''}
                  </p>
                  <div className="h-px bg-slate-300 w-full my-2" />
                </div>

                {/* Professional Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <User size={12} /> Professional Summary
                  </h3>
                  <p className="text-slate-600 text-justify text-[10px] leading-relaxed">
                    {summary}
                  </p>
                </div>

                {/* Pathway Curriculum Progress & Level */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Award size={12} /> Certified Curriculum Pathway
                  </h3>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 gap-4">
                    <div className="space-y-1 font-sans text-[10px]">
                      <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wider">Level & Achievements</span>
                      <p className="font-bold text-slate-800">Pathway Level: {level} ({xp} XP Earned)</p>
                      <p className="text-slate-600">Specialization Track: General Data Science</p>
                    </div>
                    <div className="space-y-1 font-sans text-[10px]">
                      <span className="text-slate-500 block uppercase font-bold text-[8px] tracking-wider">Connected Profiles</span>
                      <p className="text-slate-600">
                        {activePlatforms.length > 0 ? activePlatforms.join(', ') : 'No external credentials linked'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom Capstone Project Detail */}
                {customCapstone && (
                  <div className="space-y-1.5">
                    <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Sparkles size={12} /> AI Capstone Project
                    </h3>
                    <div className="p-3 border border-slate-200 rounded-lg space-y-1 font-sans text-[10px]">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{customCapstone.title || 'Custom AI Capstone Project'}</span>
                        <span className="text-slate-500 font-mono text-[9px]">{customCapstone.domain}</span>
                      </div>
                      <p className="text-slate-600 text-[9px] italic leading-normal">
                        Implemented using {customCapstone.technique} with an {customCapstone.deployment} deployment model.
                      </p>
                      {customCapstone.repoUrl && (
                        <p className="text-[9px] text-blue-600 font-mono flex items-center gap-1 mt-1">
                          <Link2 size={10} /> {customCapstone.repoUrl}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {experience.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <Briefcase size={12} /> Professional Experience
                    </h3>
                    <div className="space-y-2">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-sans text-[10px] font-bold text-slate-800">
                            <span>{exp.role} &mdash; <span className="font-normal text-slate-600">{exp.company}</span></span>
                            <span className="font-normal text-slate-500 text-[9px] font-mono">{exp.duration}</span>
                          </div>
                          <p className="text-slate-600 text-[9px] leading-relaxed pl-2 border-l-2 border-slate-200">
                            {exp.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-[11px] font-bold font-sans uppercase tracking-wider text-slate-900 flex items-center gap-2">
                      <GraduationCap size={12} /> Education
                    </h3>
                    <div className="space-y-2">
                      {education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between font-sans text-[10px] text-slate-800">
                          <span className="font-bold">{edu.degree} &mdash; <span className="font-normal text-slate-600">{edu.school}</span></span>
                          <span className="font-normal text-slate-500 text-[9px] font-mono">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verified Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-center font-sans text-[8px] text-slate-400">
                Data Scientist Path verified profile &bull; Created on {new Date().toLocaleDateString()} &bull; ID: {currentUser?.uid || 'ANON_ID'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
