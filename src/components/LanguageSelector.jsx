import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };

      const addScript = document.createElement('script');
      addScript.id = 'google-translate-script';
      addScript.setAttribute(
        'src',
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      );
      document.body.appendChild(addScript);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setCurrentLang(lang);
    
    // Trigger the hidden Google Translate dropdown
    const gtSelect = document.querySelector('.goog-te-combo');
    if (gtSelect) {
      gtSelect.value = lang;
      gtSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  return (
    <div className="relative w-full">
      {/* Hidden original widget, use off-screen positioning instead of display:none to ensure it renders */}
      <div 
        id="google_translate_element" 
        style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      ></div>
      
      {/* Our beautiful custom widget */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover border border-border-strong rounded-lg transition-colors cursor-pointer group focus-within:ring-2 focus-within:ring-phase-teal focus-within:border-transparent">
        <Globe size={16} className="text-text-faint group-hover:text-phase-teal transition-colors shrink-0" />
        <select 
          value={currentLang} 
          onChange={handleLanguageChange}
          className="bg-transparent text-sm font-medium text-text-main w-full focus:outline-none cursor-pointer appearance-none"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh-CN">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
        </select>
        
        {/* Custom arrow for select */}
        <div className="pointer-events-none text-text-faint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}
