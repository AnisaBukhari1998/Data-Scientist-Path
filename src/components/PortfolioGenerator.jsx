import { useState, useEffect, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PHASES } from '../data/roadmap';
import { 
  User, Mail, Globe, Briefcase, GraduationCap, 
  Download, Eye, Edit3, CheckCircle2, Award, Sparkles, BookOpen, 
  ArrowRight, Plus, Trash2, Code, ShieldCheck 
} from 'lucide-react';

const PALETTES = [
  { name: 'Teal', primary: '#7bc8c4', text: 'text-phase-teal', bgLight: 'bg-phase-teal/10' },
  { name: 'Amber', primary: '#e8a87c', text: 'text-phase-amber', bgLight: 'bg-phase-amber/10' },
  { name: 'Rose', primary: '#d4849a', text: 'text-phase-rose', bgLight: 'bg-phase-rose/10' },
  { name: 'Violet', primary: '#9b8ec4', text: 'text-phase-violet', bgLight: 'bg-phase-violet/10' },
  { name: 'Gold', primary: '#d4b87c', text: 'text-phase-gold', bgLight: 'bg-phase-gold/10' },
  { name: 'Blue', primary: '#3b82f6', text: 'text-blue-500', bgLight: 'bg-blue-500/10' }
];

export function PortfolioGenerator() {
  const { progress, isCompleted, getProjectLink, getResourceLink } = useProgress();

  // Active Style options
  const [activeTemplate, setActiveTemplate] = useState('pastel'); // 'pastel' | 'dark' | 'corporate'
  const [accentColor, setAccentColor] = useState('#9b8ec4'); // Default Violet
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profileTitle, setProfileTitle] = useState('Data Scientist & ML Engineer');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileBio, setProfileBio] = useState('Passionate data science student mastering machine learning algorithms, statistical pipelines, and production deployments.');
  
  // Social Profiles
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [kaggleUrl, setKaggleUrl] = useState('');
  const [mediumUrl, setMediumUrl] = useState('');

  // Skills
  const [languagesLibraries, setLanguagesLibraries] = useState('Python, SQL, R, Pandas, NumPy, Scikit-Learn, TensorFlow, PyTorch');
  const [mlModeling, setMlModeling] = useState('Supervised/Unsupervised Learning, Deep Neural Networks, Random Forest, XGBoost, NLP');
  const [pipelinesTools, setPipelinesTools] = useState('Apache Spark, Kafka, FastAPI, Docker, Git, MLflow, AWS, PostgreSQL');

  // Languages Spoken
  const [spokenLanguages, setSpokenLanguages] = useState('English (Native), Spanish (Conversational)');

  // Custom Experience & Education
  const [experiences, setExperiences] = useState([
    { role: 'Data Analyst Intern', company: 'Agricultural Analytics Co.', duration: '2025 - Present', desc: 'Designed automated data cleaning pipelines in Pandas and built Streamlit dashboard reporting tool.' }
  ]);
  const [educations, setEducations] = useState([
    { degree: 'B.S. in Computer Science', school: 'Tech University', year: '2024' }
  ]);

  // Custom Projects (in addition to roadmap verified ones)
  const [customProjects, setCustomProjects] = useState([]);
  // Custom Certifications (in addition to roadmap verified ones)
  const [customCerts, setCustomCerts] = useState([]);

  // Sync profile details from connected GitHub if present
  useEffect(() => {
    if (progress._githubUser) {
      if (!profileName) setProfileName(progress._githubUser.name || progress._githubUser.username);
      if (!githubUrl) setGithubUrl(`https://github.com/${progress._githubUser.username}`);
      if (!profileAvatar) setProfileAvatar(progress._githubUser.avatar_url || '');
    }
  }, [progress._githubUser]);

  // Gather verified portfolio projects from roadmap
  const verifiedProjects = useMemo(() => {
    const list = [];
    PHASES.forEach(phase => {
      phase.projects.forEach((proj, idx) => {
        const linkData = getProjectLink(phase.key, idx);
        const completed = isCompleted(phase.key, 'projects', idx);
        
        if (completed || linkData) {
          const url = typeof linkData === 'object' && linkData ? linkData.url : linkData || '';
          const verified = typeof linkData === 'object' && linkData ? linkData.verified : false;
          list.push({
            title: proj[0],
            skills: proj[1],
            url,
            verified,
            phaseTitle: phase.title.split('—')[0].trim()
          });
        }
      });
    });
    return list;
  }, [progress, getProjectLink, isCompleted]);

  // Gather verified credentials / certifications from roadmap
  const verifiedCredentials = useMemo(() => {
    const list = [];
    PHASES.forEach(phase => {
      const categories = ['courses', 'certs'];
      categories.forEach(cat => {
        if (phase[cat]) {
          phase[cat].forEach((item, idx) => {
            const completed = isCompleted(phase.key, cat, idx);
            const linkData = getResourceLink(phase.key, cat, idx);
            if (completed || linkData) {
              list.push({
                name: item[0],
                provider: item[1],
                url: linkData?.url || '',
                verified: linkData?.verified || false
              });
            }
          });
        }
      });
    });
    return list;
  }, [progress, getResourceLink, isCompleted]);

  // Add/Remove custom elements
  const addExperience = () => setExperiences([...experiences, { role: '', company: '', duration: '', desc: '' }]);
  const removeExperience = (idx) => setExperiences(experiences.filter((_, i) => i !== idx));
  const updateExperience = (idx, field, value) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };

  const addEducation = () => setEducations([...educations, { degree: '', school: '', year: '' }]);
  const removeEducation = (idx) => setEducations(educations.filter((_, i) => i !== idx));
  const updateEducation = (idx, field, value) => {
    setEducations(educations.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));
  };

  const addCustomProject = () => setCustomProjects([...customProjects, { title: '', skills: '', url: '' }]);
  const removeCustomProject = (idx) => setCustomProjects(customProjects.filter((_, i) => i !== idx));
  const updateCustomProject = (idx, field, value) => {
    setCustomProjects(customProjects.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const addCustomCert = () => setCustomCerts([...customCerts, { name: '', provider: '', url: '' }]);
  const removeCustomCert = (idx) => setCustomCerts(customCerts.filter((_, i) => i !== idx));
  const updateCustomCert = (idx, field, value) => {
    setCustomCerts(customCerts.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  // Compile standalone HTML portfolio
  const handleExportHTML = () => {
    const name = profileName || 'Data Science Professional';
    
    // Social contacts mapping
    const socialLinks = [];
    if (profileEmail) socialLinks.push(`<a href="mailto:${profileEmail}" class="hover:underline">📧 ${profileEmail}</a>`);
    if (githubUrl) socialLinks.push(`<a href="${githubUrl}" target="_blank" class="hover:underline">🐙 GitHub</a>`);
    if (linkedinUrl) socialLinks.push(`<a href="${linkedinUrl}" target="_blank" class="hover:underline">🔗 LinkedIn</a>`);
    if (kaggleUrl) socialLinks.push(`<a href="${kaggleUrl}" target="_blank" class="hover:underline">📊 Kaggle</a>`);
    if (mediumUrl) socialLinks.push(`<a href="${mediumUrl}" target="_blank" class="hover:underline">📝 Medium</a>`);

    // Technical skills rendering
    const skillsSections = [];
    if (languagesLibraries) {
      skillsSections.push(`<div><strong class="text-slate-800 text-xs">Languages & Libraries:</strong> <span class="text-slate-500 text-xs">${languagesLibraries}</span></div>`);
    }
    if (mlModeling) {
      skillsSections.push(`<div><strong class="text-slate-800 text-xs">ML & Modeling:</strong> <span class="text-slate-500 text-xs">${mlModeling}</span></div>`);
    }
    if (pipelinesTools) {
      skillsSections.push(`<div><strong class="text-slate-800 text-xs">Pipelines & DevTools:</strong> <span class="text-slate-500 text-xs">${pipelinesTools}</span></div>`);
    }

    // Projects rendering (Verified + Custom)
    const allProjects = [
      ...verifiedProjects.map(p => ({ ...p, isVerified: true })),
      ...customProjects.map(p => ({ ...p, isVerified: false, phaseTitle: 'Custom Project' }))
    ];

    const projectsHTML = allProjects.map(p => `
      <div class="border border-slate-100 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
          <h4 class="font-bold text-slate-800 text-sm">${p.title}</h4>
          <span class="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-500">${p.phaseTitle}</span>
        </div>
        <p class="text-xs text-slate-500 mb-3">${p.skills}</p>
        ${p.url ? `
          <div class="flex items-center gap-2">
            <a href="${p.url}" target="_blank" class="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
              Code Repository ↗
            </a>
            ${p.isVerified ? `<span class="text-[10px] text-teal-600 font-bold bg-teal-50 px-1.5 py-0.5 rounded">✓ Verified</span>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');

    // Credentials rendering (Verified + Custom)
    const allCerts = [
      ...verifiedCredentials.map(c => ({ ...c, isVerified: true })),
      ...customCerts.map(c => ({ ...c, isVerified: false }))
    ];

    const certsHTML = allCerts.map(c => `
      <div class="flex items-center justify-between gap-3 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
        <div>
          <h4 class="font-semibold text-slate-800 text-xs">${c.name}</h4>
          <p class="text-[10px] text-slate-400">${c.provider} ${c.isVerified ? '• <span class="text-teal-600 font-bold">Verified</span>' : ''}</p>
        </div>
        ${c.url ? `<a href="${c.url}" target="_blank" class="text-[10px] text-indigo-600 font-bold hover:underline">View Certificate ↗</a>` : ''}
      </div>
    `).join('');

    const expHTML = experiences.map(e => `
      <div class="space-y-1">
        <div class="flex justify-between items-baseline gap-2">
          <h4 class="font-bold text-slate-800 text-sm">${e.role}</h4>
          <span class="text-xs font-medium text-slate-400 font-mono">${e.duration}</span>
        </div>
        <p class="text-xs font-semibold text-indigo-600">${e.company}</p>
        <p class="text-xs text-slate-500 leading-relaxed">${e.desc}</p>
      </div>
    `).join('');

    const eduHTML = educations.map(e => `
      <div class="space-y-1">
        <div class="flex justify-between items-baseline gap-2">
          <h4 class="font-bold text-slate-800 text-sm">${e.degree}</h4>
          <span class="text-xs font-medium text-slate-400 font-mono">${e.year}</span>
        </div>
        <p class="text-xs text-slate-500">${e.school}</p>
      </div>
    `).join('');

    // Styling configuration
    let templateStyles = '';
    let bodyClasses = 'bg-slate-50 font-sans p-6 md:p-12';
    let cardClasses = 'max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12 space-y-8';

    if (activeTemplate === 'dark') {
      bodyClasses = 'bg-slate-950 font-sans p-6 md:p-12 text-slate-300';
      cardClasses = 'max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 md:p-12 space-y-8';
      templateStyles = `
        body { background-color: #020617; color: #cbd5e1; }
        .text-slate-800 { color: #f1f5f9 !important; }
        .text-slate-500 { color: #94a3b8 !important; }
        .border-slate-100 { border-color: #1e293b !important; }
        .bg-white { background-color: #0f172a !important; }
        .bg-slate-50 { background-color: #090d16 !important; }
        .bg-slate-100 { background-color: #1e293b !important; }
        .text-indigo-600 { color: ${accentColor} !important; }
      `;
    } else if (activeTemplate === 'corporate') {
      bodyClasses = 'bg-white font-serif p-6 md:p-12';
      cardClasses = 'max-w-3xl mx-auto space-y-8 border-t-4 border-slate-800 pt-8';
      templateStyles = `
        body { font-family: Georgia, serif; background-color: #ffffff; }
        .rounded-2xl { border-radius: 0px !important; }
        .shadow-xl { box-shadow: none !important; }
        .border { border: none !important; }
        .bg-white { background: transparent !important; }
        .text-indigo-600 { color: #1e293b !important; text-decoration: underline; }
      `;
    } else {
      // Pastel template using accentColor dynamically
      templateStyles = `
        .text-indigo-600 { color: ${accentColor} !important; }
      `;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Professional Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body { font-family: 'Inter', sans-serif; }
    ${templateStyles}
  </style>
</head>
<body class="${bodyClasses}">
  <div class="${cardClasses}">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-8">
      ${profileAvatar ? `<img src="${profileAvatar}" alt="${name}" class="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md">` : ''}
      <div class="text-center sm:text-left space-y-1.5 flex-1">
        <h1 class="text-3xl font-extrabold text-slate-800">${name}</h1>
        <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600">${profileTitle}</h2>
        <div class="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 justify-center sm:justify-start">
          ${socialLinks.join(' <span class="text-slate-300">•</span> ')}
        </div>
      </div>
    </div>

    <!-- Bio -->
    <div class="space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Summary</h3>
      <p class="text-xs text-slate-500 leading-relaxed">${profileBio}</p>
    </div>

    <!-- Technical Skills -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Technical Expertise</h3>
      <div class="space-y-2 border border-slate-100 p-4 rounded-xl bg-slate-50/30">
        ${skillsSections.join('')}
      </div>
    </div>

    <!-- Projects -->
    ${allProjects.length > 0 ? `
      <div class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Featured & Verified Projects</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${projectsHTML}
        </div>
      </div>
    ` : ''}

    <!-- Experience & Education -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Experience -->
      ${experiences.length > 0 ? `
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Work History</h3>
          <div class="space-y-6">
            ${expHTML}
          </div>
        </div>
      ` : ''}

      <!-- Education -->
      <div class="space-y-6">
        ${educations.length > 0 ? `
          <div class="space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Education</h3>
            <div class="space-y-6">
              ${eduHTML}
            </div>
          </div>
        ` : ''}

        ${spokenLanguages ? `
          <div class="space-y-2">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Languages</h3>
            <p class="text-xs text-slate-500">${spokenLanguages}</p>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Verified Certifications -->
    ${allCerts.length > 0 ? `
      <div class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Certifications & Credentials</h3>
        <div class="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
          ${certsHTML}
        </div>
      </div>
    ` : ''}
  </div>
</body>
</html>
    `;

    // Download Blob trigger
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${name.toLowerCase().replace(/\s+/g, '_')}_portfolio.html`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-teal/15 rounded-xl text-phase-teal">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Data Science Portfolio Builder</h2>
            <p className="text-text-dim text-sm">Convert your verified roadmap accomplishments, courses, and custom career credentials into a downloadable job-ready portfolio page.</p>
          </div>
        </div>
      </header>

      {/* Editor / Preview Tabs */}
      <div className="flex border-b border-border-line">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === 'edit'
              ? 'border-phase-teal text-phase-teal font-bold'
              : 'border-transparent text-text-faint hover:text-text-dim'
          }`}
        >
          <Edit3 size={15} /> Customize Profile
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-semibold transition-all ${
            activeTab === 'preview'
              ? 'border-phase-teal text-phase-teal font-bold'
              : 'border-transparent text-text-faint hover:text-text-dim'
          }`}
        >
          <Eye size={15} /> Live Preview & Style
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tab 1: Customize Inputs */}
        {activeTab === 'edit' && (
          <div className="lg:col-span-12 space-y-6">
            {/* Personal Details */}
            <div className="flat-card p-6 border border-border-line space-y-6">
              <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                <Sparkles size={16} className="text-phase-teal" /> Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Professional Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Data Scientist"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Contact Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Profile Avatar URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-text-dim">Languages Spoken (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. English (Native), Spanish (Basic)"
                    value={spokenLanguages}
                    onChange={(e) => setSpokenLanguages(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-text-dim">Professional Summary / Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Write a summary of your career and skills..."
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Social profiles card */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                <Globe size={16} className="text-phase-teal" /> Social Media & Online Profiles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Kaggle Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://kaggle.com/..."
                    value={kaggleUrl}
                    onChange={(e) => setKaggleUrl(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Medium Blog URL</label>
                  <input
                    type="url"
                    placeholder="https://medium.com/@..."
                    value={mediumUrl}
                    onChange={(e) => setMediumUrl(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Technical Skills Inputs */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                <Code size={16} className="text-phase-teal" /> Skills & Competencies
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Languages & Core Libraries</label>
                  <input
                    type="text"
                    value={languagesLibraries}
                    onChange={(e) => setLanguagesLibraries(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Machine Learning & Modeling</label>
                  <input
                    type="text"
                    value={mlModeling}
                    onChange={(e) => setMlModeling(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Pipelines & DevTools</label>
                  <input
                    type="text"
                    value={pipelinesTools}
                    onChange={(e) => setPipelinesTools(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-4 py-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                  />
                </div>
              </div>
            </div>

            {/* Custom Projects Column */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Globe size={16} className="text-phase-teal" /> Custom Showcase Projects
                </h3>
                <button
                  onClick={addCustomProject}
                  className="text-xs text-phase-teal hover:underline font-bold"
                >
                  + Add Custom Project
                </button>
              </div>

              <div className="space-y-4">
                {customProjects.map((p, idx) => (
                  <div key={idx} className="p-4 bg-bg-main rounded-xl border border-border-line space-y-3 relative">
                    <button
                      onClick={() => removeCustomProject(idx)}
                      className="absolute top-4 right-4 text-xs text-phase-brick hover:underline"
                    >
                      Delete
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={p.title}
                        onChange={(e) => updateCustomProject(idx, 'title', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma separated)"
                        value={p.skills}
                        onChange={(e) => updateCustomProject(idx, 'skills', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="url"
                        placeholder="Repository URL"
                        value={p.url}
                        onChange={(e) => updateCustomProject(idx, 'url', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Credentials Column */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Award size={16} className="text-phase-teal" /> Custom Credentials & Certificates
                </h3>
                <button
                  onClick={addCustomCert}
                  className="text-xs text-phase-teal hover:underline font-bold"
                >
                  + Add Certification
                </button>
              </div>

              <div className="space-y-4">
                {customCerts.map((c, idx) => (
                  <div key={idx} className="p-4 bg-bg-main rounded-xl border border-border-line space-y-3 relative">
                    <button
                      onClick={() => removeCustomCert(idx)}
                      className="absolute top-4 right-4 text-xs text-phase-brick hover:underline"
                    >
                      Delete
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                      <input
                        type="text"
                        placeholder="Certification Title"
                        value={c.name}
                        onChange={(e) => updateCustomCert(idx, 'name', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="Issuer (e.g. Google, IBM)"
                        value={c.provider}
                        onChange={(e) => updateCustomCert(idx, 'provider', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="url"
                        placeholder="Verification Link"
                        value={c.url}
                        onChange={(e) => updateCustomCert(idx, 'url', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <Briefcase size={16} className="text-phase-teal" /> Work History / Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="text-xs text-phase-teal hover:underline font-bold"
                >
                  + Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-bg-main rounded-xl border border-border-line space-y-3 relative">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-4 right-4 text-xs text-phase-brick hover:underline"
                    >
                      Delete
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                      <input
                        type="text"
                        placeholder="Role / Title"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 2024 - 2025)"
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                    </div>
                    <textarea
                      placeholder="Role descriptions and achievements..."
                      rows={2}
                      value={exp.desc}
                      onChange={(e) => updateExperience(idx, 'desc', e.target.value)}
                      className="w-full bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Education History */}
            <div className="flat-card p-6 border border-border-line space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-text-main flex items-center gap-2 text-base">
                  <GraduationCap size={16} className="text-phase-teal" /> Education History
                </h3>
                <button
                  onClick={addEducation}
                  className="text-xs text-phase-teal hover:underline font-bold"
                >
                  + Add Education
                </button>
              </div>

              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-bg-main rounded-xl border border-border-line space-y-3 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-4 right-4 text-xs text-phase-brick hover:underline"
                    >
                      Delete
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.S. Data Science)"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="School / Institution"
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Year (e.g. 2024)"
                        value={edu.year}
                        onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                        className="bg-surface border border-border-line rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-phase-teal font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step Navigation */}
            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab('preview')}
                className="bg-phase-teal hover:bg-phase-teal/90 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                Go to Preview & Download <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Live Preview */}
        {activeTab === 'preview' && (
          <>
            {/* Left Options Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Template Style */}
              <div className="flat-card p-6 border border-border-line space-y-4">
                <h3 className="font-bold text-text-main text-sm">Template Style</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { key: 'pastel', label: '🌸 Pastel Glass' },
                    { key: 'dark', label: '🕶 Minimalist Dark' },
                    { key: 'corporate', label: '💼 Executive Corporate' }
                  ].map(tpl => (
                    <button
                      key={tpl.key}
                      onClick={() => setActiveTemplate(tpl.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        activeTemplate === tpl.key
                          ? 'border-phase-teal bg-phase-teal/10 text-phase-teal font-bold'
                          : 'border-border-line text-text-dim hover:text-text-main'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Selection (Only visible for Pastel & Dark) */}
              {activeTemplate !== 'corporate' && (
                <div className="flat-card p-6 border border-border-line space-y-3">
                  <h3 className="font-bold text-text-main text-sm">Accent Tone</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PALETTES.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setAccentColor(p.primary)}
                        className="py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer"
                        style={{
                          borderColor: accentColor === p.primary ? p.primary : 'var(--border-line)',
                          backgroundColor: accentColor === p.primary ? `${p.primary}15` : 'transparent',
                          color: p.primary
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Badge Summary */}
              <div className="flat-card p-6 border border-border-line space-y-3">
                <h3 className="font-bold text-text-main text-sm">Verification Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-dim">
                    <span>Verified Roadmap Projects:</span>
                    <span className="font-mono font-bold text-phase-teal">{verifiedProjects.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-dim">
                    <span>Verified Credentials:</span>
                    <span className="font-mono font-bold text-phase-teal">{verifiedCredentials.length}</span>
                  </div>
                </div>
              </div>

              {/* Export Trigger */}
              <button
                onClick={handleExportHTML}
                className="w-full bg-phase-teal hover:bg-phase-teal/90 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={16} /> Download Standalone HTML
              </button>
            </div>

            {/* Right Live Preview Box */}
            <div className="lg:col-span-8">
              <div className="border border-border-line rounded-2xl overflow-hidden bg-bg-main shadow-lg">
                <div className="px-5 py-3 border-b border-border-line bg-surface flex items-center justify-between">
                  <span className="text-xs font-mono text-text-faint">live_preview.html</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-phase-brick/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-phase-amber/60"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-phase-teal/60"></div>
                  </div>
                </div>

                {/* Simulated Webpage Body */}
                <div className={`p-6 md:p-8 max-h-[70vh] overflow-y-auto ${
                  activeTemplate === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-800'
                }`}>
                  <div className={`space-y-8 ${activeTemplate === 'corporate' ? 'font-serif' : 'font-sans'}`}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6 border-slate-100 text-center sm:text-left">
                      {profileAvatar && (
                        <img src={profileAvatar} alt={profileName} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow" />
                      )}
                      <div className="flex-1 space-y-1">
                        <h2 className={`text-2xl font-extrabold ${activeTemplate === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {profileName || 'Your Name'}
                        </h2>
                        <p className="text-xs uppercase font-bold tracking-wider" style={{ color: activeTemplate === 'corporate' ? '#1e293b' : accentColor }}>
                          {profileTitle}
                        </p>
                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 justify-center sm:justify-start font-mono">
                          {profileEmail && <span>📧 {profileEmail}</span>}
                          {githubUrl && <span>🐙 {githubUrl.replace('https://', '')}</span>}
                          {linkedinUrl && <span>🔗 {linkedinUrl.replace('https://', '')}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Professional Summary</h4>
                      <p className="text-xs leading-relaxed text-slate-500">{profileBio}</p>
                    </div>

                    {/* Skills Summary */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Technical Skills</h4>
                      <div className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                        activeTemplate === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-100'
                      }`}>
                        {languagesLibraries && <div><strong className={activeTemplate === 'dark' ? 'text-white' : 'text-slate-700'}>Languages:</strong> <span className="text-slate-400">{languagesLibraries}</span></div>}
                        {mlModeling && <div><strong className={activeTemplate === 'dark' ? 'text-white' : 'text-slate-700'}>Machine Learning:</strong> <span className="text-slate-400">{mlModeling}</span></div>}
                        {pipelinesTools && <div><strong className={activeTemplate === 'dark' ? 'text-white' : 'text-slate-700'}>Pipelines & Tools:</strong> <span className="text-slate-400">{pipelinesTools}</span></div>}
                      </div>
                    </div>

                    {/* Projects (Roadmap + Custom) */}
                    {(verifiedProjects.length > 0 || customProjects.length > 0) && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Projects</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {verifiedProjects.map((p, idx) => (
                            <div key={idx} className={`border p-3 rounded-xl ${
                              activeTemplate === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100'
                            }`}>
                              <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                                <h5 className={`font-bold text-xs ${activeTemplate === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{p.title}</h5>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">Verified</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mb-2">{p.skills}</p>
                            </div>
                          ))}
                          {customProjects.map((p, idx) => (
                            <div key={`custom-${idx}`} className={`border p-3 rounded-xl ${
                              activeTemplate === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100'
                            }`}>
                              <div className="flex items-center justify-between gap-1 flex-wrap mb-1">
                                <h5 className={`font-bold text-xs ${activeTemplate === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{p.title || 'Project'}</h5>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">Custom</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mb-2">{p.skills}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work & Edu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Work */}
                      {experiences.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Work History</h4>
                          <div className="space-y-4">
                            {experiences.map((exp, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-baseline gap-2">
                                  <h5 className={`font-bold text-xs ${activeTemplate === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{exp.role || 'Role Title'}</h5>
                                  <span className="text-[9px] text-slate-400 font-mono">{exp.duration || '2025'}</span>
                                </div>
                                <p className="text-[10px] font-semibold text-indigo-600">{exp.company || 'Company'}</p>
                                <p className="text-[10.5px] text-slate-400 leading-relaxed">{exp.desc || 'Responsibilities'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Edu */}
                      <div className="space-y-4">
                        {educations.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Education</h4>
                            <div className="space-y-3">
                              {educations.map((edu, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between items-baseline gap-2">
                                    <h5 className={`font-bold text-xs ${activeTemplate === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{edu.degree || 'Degree'}</h5>
                                    <span className="text-[9px] text-slate-400 font-mono">{edu.year || '2024'}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">{edu.school || 'School'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {spokenLanguages && (
                          <div className="space-y-1.5 pt-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Languages</h4>
                            <p className="text-[11px] text-slate-400">{spokenLanguages}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verified Credentials */}
                    {(verifiedCredentials.length > 0 || customCerts.length > 0) && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Certifications</h4>
                        <div className={`border p-4 rounded-xl space-y-2.5 ${
                          activeTemplate === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50/50'
                        }`}>
                          {verifiedCredentials.map((c, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-2 border-b last:border-0 pb-1.5 last:pb-0 border-slate-100">
                              <div>
                                <h5 className={`font-semibold text-[11px] ${activeTemplate === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{c.name}</h5>
                                <p className="text-[9.5px] text-slate-400">{c.provider} • Verified</p>
                              </div>
                            </div>
                          ))}
                          {customCerts.map((c, idx) => (
                            <div key={`custom-cert-${idx}`} className="flex justify-between items-center gap-2 border-b last:border-0 pb-1.5 last:pb-0 border-slate-100">
                              <div>
                                <h5 className={`font-semibold text-[11px] ${activeTemplate === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{c.name || 'Certification'}</h5>
                                <p className="text-[9.5px] text-slate-400">{c.provider || 'Issuer'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
