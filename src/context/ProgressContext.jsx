import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteField, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { PHASES } from '../data/roadmap';

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const { currentUser } = useAuth();
  
  // Format: { 'phase-1': { courses: [0, 1], books: [3] } }
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activePdf, setActivePdf] = useState(null);

  const openPdf = useCallback((url, title) => {
    setActivePdf({ url, title });
  }, []);

  const closePdf = useCallback(() => {
    setActivePdf(null);
  }, []);

  // Undo support
  const [lastAction, setLastAction] = useState(null);

  // Load from localStorage as fallback when not logged in
  useEffect(() => {
    if (!currentUser) {
      const localData = localStorage.getItem('dsp_progress');
      if (localData) {
        setProgress(JSON.parse(localData));
      } else {
        setProgress({});
      }
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid);
    
    // Listen to changes in real-time
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProgress(docSnap.data().progress || {});
      } else {
        // If document doesn't exist, create it with empty progress
        setDoc(docRef, { progress: {} }, { merge: true });
        setProgress({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching progress:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // ---------- Sync helper with Offline Caching & Auto-Sync ----------
  const syncProgress = useCallback(async (newProgress) => {
    setProgress(newProgress);
    
    // Always store in localStorage as a backup cache
    localStorage.setItem('dsp_progress', JSON.stringify(newProgress));

    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { progress: newProgress }, { merge: true });
        localStorage.removeItem('dsp_needs_sync');
      } catch (error) {
        console.warn("Offline: progress saved locally. Will sync when online.", error);
        localStorage.setItem('dsp_needs_sync', 'true');
      }
    }
  }, [currentUser]);

  // Listen for online status to trigger automatic sync
  useEffect(() => {
    const handleOnline = async () => {
      const needsSync = localStorage.getItem('dsp_needs_sync') === 'true';
      if (needsSync && currentUser) {
        try {
          const localData = localStorage.getItem('dsp_progress');
          if (localData) {
            const parsed = JSON.parse(localData);
            const docRef = doc(db, 'users', currentUser.uid);
            await setDoc(docRef, { progress: parsed }, { merge: true });
            localStorage.removeItem('dsp_needs_sync');
            console.log("Offline progress successfully synced to Firestore! 📡");
          }
        } catch (err) {
          console.error("Online sync attempt failed:", err);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    // Run once on load just in case
    handleOnline();

    return () => window.removeEventListener('online', handleOnline);
  }, [currentUser]);

  // ---------- Completion dates (for real charts on the Analytics page) ----------
  // _completedAt maps "phaseKey-category-index" to the time it was completed (ms).
  // Items completed before dates were recorded get 0, meaning "date unknown",
  // so old progress never shows up as activity on today's date.
  useEffect(() => {
    if (loading) return;
    const CATS = ['courses', 'books', 'videos', 'websites', 'certs', 'projects'];
    const done = new Set();
    for (const phase of PHASES) {
      for (const cat of CATS) {
        (phase[cat] || []).forEach((_, index) => {
          const key = `${phase.key}-${cat}-${index}`;
          if ((progress[phase.key]?.[cat] || []).includes(index) || progress._resourceProgress?.[key] === 100) {
            done.add(key);
          }
        });
      }
    }
    // Un-ticked items are set to null rather than deleted, because progress is saved
    // with Firestore's merge mode, which never removes keys inside a map.
    const firstTime = progress._completedAt === undefined;
    const current = progress._completedAt || {};
    const next = { ...current };
    let changed = firstTime;
    const now = Date.now();
    for (const key of done) {
      if (current[key] === undefined || current[key] === null) {
        next[key] = firstTime ? 0 : now;
        changed = true;
      }
    }
    for (const key of Object.keys(current)) {
      if (!done.has(key) && current[key] !== null) {
        next[key] = null;
        changed = true;
      }
    }
    if (changed) syncProgress({ ...progress, _completedAt: next });
  }, [progress, loading, syncProgress]);

  // ---------- Granular Progress Tracking ----------
  const getItemProgress = (phaseKey, category, index) => {
    if ((progress[phaseKey]?.[category] || []).includes(index)) {
      return 100;
    }
    const key = `${phaseKey}-${category}-${index}`;
    if (progress._resourceProgress && progress._resourceProgress[key] !== undefined) {
      return progress._resourceProgress[key];
    }
    return 0;
  };

  const setItemProgress = async (phaseKey, category, index, percent) => {
    const key = `${phaseKey}-${category}-${index}`;
    const newProgress = { ...progress };
    
    newProgress._resourceProgress = {
      ...(newProgress._resourceProgress || {}),
      [key]: percent
    };

    const currentPhase = newProgress[phaseKey] || {};
    const currentCat = currentPhase[category] || [];
    
    let newCat;
    if (percent === 100) {
      if (!currentCat.includes(index)) {
        newCat = [...currentCat, index];
        let newXp = newProgress._xp || 0;
        let newLevel = newProgress._level || 1;
        newXp += 15; // Give 15 XP for a fully completed resource
        let threshold = newLevel * 100;
        if (newXp >= threshold) {
          newXp -= threshold;
          newLevel += 1;
          setTimeout(() => {
            alert(`🎉 Level Up! You reached Level ${newLevel}!`);
          }, 200);
        }
        newProgress._xp = newXp;
        newProgress._level = newLevel;
      } else {
        newCat = currentCat;
      }
    } else {
      newCat = currentCat.filter(i => i !== index);
    }
    
    newProgress[phaseKey] = {
      ...currentPhase,
      [category]: newCat
    };

    await syncProgress(newProgress);
  };

  // ---------- Sub-Module Tracking Helpers ----------
  const isSubModuleChecked = (phaseKey, category, index, subIndex) => {
    const key = `${phaseKey}-${category}-${index}-${subIndex}`;
    if ((progress[phaseKey]?.[category] || []).includes(index)) {
      return true;
    }
    return !!(progress._checkedSubModules && progress._checkedSubModules[key]);
  };

  const toggleSubModule = async (phaseKey, category, index, subIndex, totalSubModules) => {
    const key = `${phaseKey}-${category}-${index}-${subIndex}`;
    const newProgress = { ...progress };
    const currentlyChecked = isSubModuleChecked(phaseKey, category, index, subIndex);
    
    newProgress._checkedSubModules = {
      ...(newProgress._checkedSubModules || {}),
      [key]: !currentlyChecked
    };

    // Calculate new completion percentage
    let checkedCount = 0;
    for (let i = 0; i < totalSubModules; i++) {
      const subKey = `${phaseKey}-${category}-${index}-${i}`;
      if (newProgress._checkedSubModules[subKey]) {
        checkedCount++;
      }
    }
    const newPercent = Math.round((checkedCount / totalSubModules) * 100);

    newProgress._resourceProgress = {
      ...(newProgress._resourceProgress || {}),
      [`${phaseKey}-${category}-${index}`]: newPercent
    };

    const currentPhase = newProgress[phaseKey] || {};
    const currentCat = currentPhase[category] || [];
    
    let newCat;
    if (newPercent === 100) {
      if (!currentCat.includes(index)) {
        newCat = [...currentCat, index];
        let newXp = newProgress._xp || 0;
        let newLevel = newProgress._level || 1;
        newXp += 15;
        let threshold = newLevel * 100;
        if (newXp >= threshold) {
          newXp -= threshold;
          newLevel += 1;
          setTimeout(() => {
            alert(`🎉 Level Up! You reached Level ${newLevel}!`);
          }, 200);
        }
        newProgress._xp = newXp;
        newProgress._level = newLevel;
      } else {
        newCat = currentCat;
      }
    } else {
      newCat = currentCat.filter(i => i !== index);
    }
    
    newProgress[phaseKey] = {
      ...currentPhase,
      [category]: newCat
    };

    await syncProgress(newProgress);
  };

  // ---------- Toggle item (with progress fallback and sub-module sync) ----------
  const toggleItem = async (phaseKey, category, index, totalSubModules = 4) => {
    const currentProgress = getItemProgress(phaseKey, category, index);
    const wasCompleted = currentProgress === 100;
    const newPercent = wasCompleted ? 0 : 100;

    const newProgress = { ...progress };
    
    newProgress._checkedSubModules = { ...(newProgress._checkedSubModules || {}) };
    for (let i = 0; i < totalSubModules; i++) {
      const subKey = `${phaseKey}-${category}-${index}-${i}`;
      newProgress._checkedSubModules[subKey] = !wasCompleted;
    }

    newProgress._resourceProgress = {
      ...(newProgress._resourceProgress || {}),
      [`${phaseKey}-${category}-${index}`]: newPercent
    };

    const currentPhase = newProgress[phaseKey] || {};
    const currentCat = currentPhase[category] || [];
    
    let newCat;
    if (newPercent === 100) {
      if (!currentCat.includes(index)) {
        newCat = [...currentCat, index];
        let newXp = newProgress._xp || 0;
        let newLevel = newProgress._level || 1;
        newXp += 15;
        let threshold = newLevel * 100;
        if (newXp >= threshold) {
          newXp -= threshold;
          newLevel += 1;
          setTimeout(() => {
            alert(`🎉 Level Up! You reached Level ${newLevel}!`);
          }, 200);
        }
        newProgress._xp = newXp;
        newProgress._level = newLevel;
      } else {
        newCat = currentCat;
      }
    } else {
      newCat = currentCat.filter(i => i !== index);
    }
    
    newProgress[phaseKey] = {
      ...currentPhase,
      [category]: newCat
    };

    await syncProgress(newProgress);
    setLastAction({ type: 'toggle', phaseKey, category, index, wasCompleted });
  };

  const isCompleted = (phaseKey, category, index) => {
    return getItemProgress(phaseKey, category, index) === 100;
  };

  // ---------- Reset all progress ----------
  const resetAllProgress = useCallback(async () => {
    localStorage.removeItem('dsp_progress');
    localStorage.removeItem('dsp_needs_sync');
    setProgress({});
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { progress: {} }, { merge: true });
      } catch (error) {
        console.error("Error resetting progress in Firestore:", error);
      }
    }
  }, [currentUser]);

  // ---------- Undo support ----------
  const undoLastAction = useCallback(async () => {
    if (!lastAction || lastAction.type !== 'toggle') return;

    const { phaseKey, category, index, wasCompleted } = lastAction;
    const currentPhaseProgress = progress[phaseKey] || {};
    const currentCategoryProgress = currentPhaseProgress[category] || [];

    let newCategoryProgress;
    if (wasCompleted) {
      // It was completed before toggle removed it — re-add it
      if (!currentCategoryProgress.includes(index)) {
        newCategoryProgress = [...currentCategoryProgress, index];
      } else {
        newCategoryProgress = currentCategoryProgress;
      }
    } else {
      // It was not completed before toggle added it — remove it
      newCategoryProgress = currentCategoryProgress.filter(i => i !== index);
    }

    const newProgress = {
      ...progress,
      [phaseKey]: {
        ...currentPhaseProgress,
        [category]: newCategoryProgress
      }
    };

    setLastAction(null);
    await syncProgress(newProgress);
  }, [lastAction, progress, syncProgress]);

  const clearLastAction = useCallback(() => {
    setLastAction(null);
  }, []);

  // ---------- Project links ----------
  const setProjectLink = async (phaseKey, index, url) => {
    const currentPhaseProgress = progress[phaseKey] || {};
    const currentLinks = currentPhaseProgress.projectLinks || {};

    const newProgress = {
      ...progress,
      [phaseKey]: {
        ...currentPhaseProgress,
        projectLinks: {
          ...currentLinks,
          [index]: url
        }
      }
    };

    await syncProgress(newProgress);
  };

  const getProjectLink = (phaseKey, index) => {
    return progress[phaseKey]?.projectLinks?.[index] || null;
  };

  // ---------- Capstone links ----------
  const setCapstoneLink = useCallback(async (phaseNum, url) => {
    const currentLinks = progress._capstoneLinks || {};
    const newProgress = {
      ...progress,
      _capstoneLinks: {
        ...currentLinks,
        [phaseNum]: url
      }
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const getCapstoneLink = useCallback((phaseNum) => {
    return progress._capstoneLinks?.[phaseNum] || null;
  }, [progress]);

  const saveCustomCapstone = useCallback(async (customCapstone) => {
    const newProgress = {
      ...progress,
      _customCapstone: customCapstone
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const saveCustomAvatar = useCallback(async (customAvatar) => {
    const newProgress = {
      ...progress,
      _customAvatar: customAvatar
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  // ---------- Resource links ----------
  const setResourceLink = async (phaseKey, category, index, data) => {
    const currentPhaseProgress = progress[phaseKey] || {};
    const currentLinks = currentPhaseProgress.resourceLinks || {};
    const key = `${category}-${index}`;

    const newProgress = {
      ...progress,
      [phaseKey]: {
        ...currentPhaseProgress,
        resourceLinks: {
          ...currentLinks,
          [key]: data
        }
      }
    };

    await syncProgress(newProgress);
  };

  const getResourceLink = (phaseKey, category, index) => {
    const key = `${category}-${index}`;
    return progress[phaseKey]?.resourceLinks?.[key] || null;
  };

  // ---------- Bookmarks ----------
  const toggleBookmark = useCallback(async (phaseKey, category, index) => {
    const currentBookmarks = progress._bookmarks || [];
    const exists = currentBookmarks.some(
      b => b.phaseKey === phaseKey && b.category === category && b.index === index
    );

    let newBookmarks;
    if (exists) {
      newBookmarks = currentBookmarks.filter(
        b => !(b.phaseKey === phaseKey && b.category === category && b.index === index)
      );
    } else {
      newBookmarks = [...currentBookmarks, { phaseKey, category, index }];
    }

    const newProgress = {
      ...progress,
      _bookmarks: newBookmarks
    };

    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const isBookmarked = useCallback((phaseKey, category, index) => {
    const bookmarks = progress._bookmarks || [];
    return bookmarks.some(
      b => b.phaseKey === phaseKey && b.category === category && b.index === index
    );
  }, [progress]);

  // ---------- Notes ----------
  const setNote = useCallback(async (phaseKey, category, index, text) => {
    const noteKey = `${phaseKey}-${category}-${index}`;
    const currentNotes = progress._notes || {};

    let newNotes;
    if (!text || text.trim() === '') {
      // Remove the note if text is empty
      const { [noteKey]: _, ...rest } = currentNotes;
      newNotes = rest;
    } else {
      newNotes = { ...currentNotes, [noteKey]: text };
    }

    const newProgress = {
      ...progress,
      _notes: newNotes
    };

    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const getNote = useCallback((phaseKey, category, index) => {
    const noteKey = `${phaseKey}-${category}-${index}`;
    return progress._notes?.[noteKey] || '';
  }, [progress]);

  // ---------- Master Capstone ----------
  const toggleMasterMilestone = useCallback(async (milestoneId) => {
    const currentMilestones = progress._masterMilestones || [];
    const exists = currentMilestones.includes(milestoneId);

    let newMilestones;
    if (exists) {
      newMilestones = currentMilestones.filter(id => id !== milestoneId);
    } else {
      newMilestones = [...currentMilestones, milestoneId];
    }

    const newProgress = {
      ...progress,
      _masterMilestones: newMilestones
    };

    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const isMasterMilestoneCompleted = useCallback((milestoneId) => {
    const currentMilestones = progress._masterMilestones || [];
    return currentMilestones.includes(milestoneId);
  }, [progress]);

  // ---------- Really delete saved fields ----------
  // Progress is saved with Firestore's merge mode, which never removes keys, so removing
  // a key from the object is not enough. This deletes fields both here and in Firestore.
  // paths look like '_githubUser' or '_githubUser.token'.
  const removeProgressFields = useCallback(async (paths) => {
    const strip = (obj, path) => {
      const [head, ...rest] = path.split('.');
      if (!obj || typeof obj !== 'object' || !(head in obj)) return obj;
      if (rest.length === 0) {
        const copy = { ...obj };
        delete copy[head];
        return copy;
      }
      return { ...obj, [head]: strip(obj[head], rest.join('.')) };
    };
    setProgress(prev => {
      let next = prev;
      for (const path of paths) next = strip(next, path);
      localStorage.setItem('dsp_progress', JSON.stringify(next));
      return next;
    });
    if (currentUser) {
      const updates = Object.fromEntries(paths.map(path => [`progress.${path}`, deleteField()]));
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      } catch (err) {
        console.warn('Could not delete saved fields:', err);
      }
    }
  }, [currentUser]);

  // One-time clean-up: older versions saved a GitHub access token and a Gemini API key
  // in progress. Neither is needed any more, so delete them wherever they still exist.
  useEffect(() => {
    if (loading) return;
    const stale = [];
    if (progress._geminiApiKey !== undefined) stale.push('_geminiApiKey');
    if (progress._githubUser && progress._githubUser.token !== undefined) stale.push('_githubUser.token');
    if (stale.length) removeProgressFields(stale);
  }, [progress, loading, removeProgressFields]);

  // ---------- GitHub Integration ----------
  // Only public profile details are stored (username, name, avatar), never a token.
  const setGithubUser = useCallback(async (githubData) => {
    const { username, name, avatarUrl } = githubData;
    await syncProgress({ ...progress, _githubUser: { username, name, avatarUrl } });
  }, [progress, syncProgress]);

  const disconnectGithub = useCallback(async () => {
    await removeProgressFields(['_githubUser']);
  }, [removeProgressFields]);

  // ---------- External Profiles Sync ----------
  const syncExternalProfiles = useCallback(async (profiles) => {
    const newProgress = { ...progress };
    
    // Save credentials
    newProgress._externalProfiles = profiles;

    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  // ---------- Gamification XP Engine ----------
  const addXp = useCallback(async (amount) => {
    const currentXp = progress._xp || 0;
    const currentLevel = progress._level || 1;
    let newXp = currentXp + amount;
    let newLevel = currentLevel;
    let xpThreshold = currentLevel * 100;
    let leveledUp = false;
    
    while (newXp >= xpThreshold) {
      newXp = newXp - xpThreshold;
      newLevel += 1;
      xpThreshold = newLevel * 100;
      leveledUp = true;
    }
    
    if (leveledUp) {
      setTimeout(() => {
        // Dispatch level up event
        const event = new CustomEvent('level-up-triggered', { detail: { level: newLevel } });
        window.dispatchEvent(event);
      }, 200);
    }
    
    const newProgress = {
      ...progress,
      _xp: newXp,
      _level: newLevel
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  const buyStreakFreeze = useCallback(async () => {
    const currentXp = progress._xp || 0;
    const currentFreezes = progress._streakFreezes || 0;
    if (currentXp < 200) {
      alert("Not enough XP! 1 Streak Freeze costs 200 XP.");
      return;
    }
    
    const newProgress = {
      ...progress,
      _xp: currentXp - 200,
      _streakFreezes: currentFreezes + 1
    };
    await syncProgress(newProgress);
    alert("Purchased 1 Streak Freeze! ❄️");
  }, [progress, syncProgress]);

  // ---------- Custom Theme Management ----------
  const saveHslTheme = useCallback(async (h, s, l) => {
    const newProgress = {
      ...progress,
      _customHsl: { h, s, l }
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress]);

  // ---------- Daily Quests ----------
  const completeQuest = useCallback(async (id) => {
    const currentQuests = progress._quests || [
      { id: 1, text: "Grow a tree in the Focus Forest", xp: 30, done: false },
      { id: 2, text: "Answer 3 flashcards correctly", xp: 20, done: false },
      { id: 3, text: "Complete 1 coding sandbox run", xp: 25, done: false }
    ];
    
    const updatedQuests = currentQuests.map(q => {
      if (q.id === id && !q.done) {
        addXp(q.xp);
        return { ...q, done: true };
      }
      return q;
    });

    const newProgress = {
      ...progress,
      _quests: updatedQuests
    };
    await syncProgress(newProgress);
  }, [progress, syncProgress, addXp]);

  const getPhaseProgress = useCallback((phaseKey) => {
    const phase = PHASES.find(p => p.key === phaseKey);
    if (!phase) return 0;

    let totalItems = 0;
    let totalProgressSum = 0;

    const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
    categories.forEach(cat => {
      const itemsList = phase[cat] || [];
      itemsList.forEach((item, index) => {
        totalItems++;
        const defaultPercent = Array.isArray(item) ? (item[6] !== undefined ? item[6] : 0) : 0;
        totalProgressSum += getItemProgress(phaseKey, cat, index, defaultPercent);
      });
    });

    if (totalItems === 0) return 0;
    return Math.round(totalProgressSum / totalItems);
  }, [progress]);

  const getOverallProgress = useCallback(() => {
    let totalItems = 0;
    let totalProgressSum = 0;

    PHASES.forEach(phase => {
      const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
      categories.forEach(cat => {
        const itemsList = phase[cat] || [];
        itemsList.forEach((item, index) => {
          totalItems++;
          const defaultPercent = Array.isArray(item) ? (item[6] !== undefined ? item[6] : 0) : 0;
          totalProgressSum += getItemProgress(phase.key, cat, index, defaultPercent);
        });
      });
    });

    if (totalItems === 0) return 0;
    return Math.round(totalProgressSum / totalItems);
  }, [progress]);

  const value = {
    progress,
    syncProgress, // save progress to the browser and (when signed in) Firestore
    loading,
    toggleItem,
    isCompleted,
    getItemProgress,
    setItemProgress,
    isSubModuleChecked,
    toggleSubModule,
    getPhaseProgress,
    getOverallProgress,
    setProjectLink,
    getProjectLink,
    setResourceLink,
    getResourceLink,
    setProgress,
    resetAllProgress,
    // Bookmarks
    toggleBookmark,
    isBookmarked,
    // Notes
    setNote,
    getNote,
    // Undo
    lastAction,
    undoLastAction,
    clearLastAction,
    // Master Capstone
    toggleMasterMilestone,
    isMasterMilestoneCompleted,
    setCapstoneLink,
    getCapstoneLink,
    saveCustomCapstone,
    saveCustomAvatar,
    // GitHub Integration
    setGithubUser,
    disconnectGithub,
    // External Profiles
    syncExternalProfiles,
    // Gamification & Personalization
    addXp,
    buyStreakFreeze,
    saveHslTheme,
    completeQuest,
    // PDF Viewer
    activePdf,
    openPdf,
    closePdf
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
