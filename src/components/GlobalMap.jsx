import { useState, useEffect } from 'react';
import { Globe, Users, Clock, Flame, ChevronRight, MessageSquare, Target, Shield, HelpCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { playClick, playSuccess } from '../utils/audioEngine';

const ACTIVE_PEER_PINS = [
  { id: 'sf', name: "San Francisco Lab", lat: 30, lng: 15, peers: 8, focus: "Transformers Fine-Tuning", activeTime: "12m left" },
  { id: 'ny', name: "New York Stats Club", lat: 33, lng: 32, peers: 12, focus: "Lasso coordinate descent", activeTime: "45m left" },
  { id: 'london', name: "London Deep Coding", lat: 22, lng: 48, peers: 5, focus: "FastAPI async routes", activeTime: "18m left" },
  { id: 'bangalore', name: "Bangalore Python Arena", lat: 52, lng: 68, peers: 15, focus: "Pandas merge optimization", activeTime: "30m left" },
  { id: 'tokyo', name: "Tokyo AI Research Hub", lat: 42, lng: 82, peers: 9, focus: "QLoRA double quant", activeTime: "5m left" },
  { id: 'sydney', name: "Sydney ML Greenhouse", lat: 78, lng: 88, peers: 4, focus: "Kubernetes liveness probes", activeTime: "25m left" }
];

const MOCK_LOBBY_EVENTS = [
  "Alex (SF Lab) just earned +10 XP completing Python lists",
  "Rohan (Bangalore Arena) started a 50min focus session",
  "Chao (Tokyo AI Hub) passed the Phase 3 deep learning quiz!",
  "Emma (London Deep Coding) bookmarked a math reference doc",
  "Priya just uploaded a capstone predictions CSV file!"
];

export function GlobalMap() {
  const { progress } = useProgress();
  const { currentUser } = useAuth();
  
  const [selectedRoom, setSelectedRoom] = useState(ACTIVE_PEER_PINS[0]);
  const [events, setEvents] = useState(MOCK_LOBBY_EVENTS);
  const [roomParticipants, setRoomParticipants] = useState(128); // Mock general peers count

  // Privacy Level state loaded from local settings
  const [privacyLevel, setPrivacyLevel] = useState(() => {
    return localStorage.getItem('location-privacy') || 'city';
  });

  // User coordinate states
  const [userCoords, setUserCoords] = useState(null);

  // Load user geolocation coordinates on mount, applying filter criteria
  useEffect(() => {
    if (privacyLevel === 'invisible') {
      setUserCoords(null);
      return;
    }

    // Default mock coordinates (e.g. New Delhi area) if geolocation fails or is denied
    let lat = 28.6139;
    let lng = 77.2090;

    const applyJitterAndSet = (baseLat, baseLng) => {
      let finalLat = baseLat;
      let finalLng = baseLng;

      // Seed-based stable offset depending on privacy setting
      if (privacyLevel === 'city') {
        // Subtle offset (approx 5-10km accuracy)
        finalLat += 0.05;
        finalLng -= 0.04;
      } else if (privacyLevel === 'state') {
        // Larger offset (approx 50-100km accuracy)
        finalLat += 0.65;
        finalLng -= 0.85;
      } else if (privacyLevel === 'country') {
        // General country center offset
        finalLat = 20.5937;
        finalLng = 78.9629;
      }

      // Project spherical lat/lng to approximate percentage coordinates for interactive SVG grid view
      // Mercator scaling: lat [ -60 to 80 ], lng [ -160 to 180 ] mapped to 0-100%
      const projectedLat = 100 - ((finalLat - (-60)) / (80 - (-60))) * 100;
      const projectedLng = ((finalLng - (-160)) / (180 - (-160))) * 100;

      setUserCoords({
        lat: Math.max(10, Math.min(90, projectedLat)),
        lng: Math.max(10, Math.min(90, projectedLng)),
        rawLat: finalLat.toFixed(4),
        rawLng: finalLng.toFixed(4)
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyJitterAndSet(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to default mock position
          applyJitterAndSet(lat, lng);
        }
      );
    } else {
      applyJitterAndSet(lat, lng);
    }
  }, [privacyLevel]);

  // Listen for settings change to update privacy model reactively
  useEffect(() => {
    const handleSettingsChange = () => {
      setPrivacyLevel(localStorage.getItem('location-privacy') || 'city');
    };
    window.addEventListener('settings-changed', handleSettingsChange);
    return () => window.removeEventListener('settings-changed', handleSettingsChange);
  }, []);

  // Periodically add new mock events to show live peer updates
  useEffect(() => {
    const timer = setInterval(() => {
      const randomNames = ["Devin", "Yuki", "Chloe", "Juan", "Mei", "Fatima"];
      const randomRooms = ["SF Lab", "Tokyo AI Hub", "London Deep Coding", "New York Stats Club"];
      const randomActions = ["passed a refresher quiz!", "joined a Pomodoro study timer", "completed a SQL index task", "earned +10 XP"];
      
      const newEvent = `${randomNames[Math.floor(Math.random() * randomNames.length)]} (${randomRooms[Math.floor(Math.random() * randomRooms.length)]}) ${randomActions[Math.floor(Math.random() * randomActions.length)]}`;
      
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
      setRoomParticipants(p => p + (Math.random() > 0.5 ? 1 : -1));
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-border-line p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display text-text-main flex items-center gap-2">
            <Globe className="text-phase-teal animate-spin-slow" />
            Global Study Map
          </h2>
          <p className="text-sm text-text-dim mt-1">Study in real-time alongside other students completing the Pathway.</p>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <div className="bg-bg-raise border border-border-line px-4 py-2.5 rounded-xl">
            Peers Online: <span className="text-phase-teal font-bold">{roomParticipants}</span>
          </div>
          <div className="bg-bg-raise border border-border-line px-4 py-2.5 rounded-xl">
            Active Rooms: <span className="text-phase-violet font-bold">{ACTIVE_PEER_PINS.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Interactive Map Grid */}
        <div className="lg:col-span-2 bg-surface border border-border-line rounded-2xl p-6 shadow-sm relative overflow-hidden h-[450px] flex flex-col justify-between">
          <span className="text-xs font-mono text-text-faint absolute top-4 left-4">Interactive Mercator Grid</span>
          
          {/* Simple Vector Map Outline (Fallback SVG styled beautifully) */}
          <div className="w-full h-full flex items-center justify-center relative mt-4">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-35 max-h-[350px]">
              {/* Stylized continent vectors */}
              {/* North America */}
              <path d="M 5 20 Q 20 20 25 35 T 40 40 T 35 55 T 15 50 Z" fill="var(--bg-raise)" stroke="var(--border-line)" strokeWidth="1" />
              {/* South America */}
              <path d="M 30 55 Q 38 65 35 85 T 28 95 T 25 80 Z" fill="var(--bg-raise)" stroke="var(--border-line)" strokeWidth="1" />
              {/* Eurasia / Africa */}
              <path d="M 45 20 Q 65 15 85 25 T 90 45 T 75 55 T 60 70 Z" fill="var(--bg-raise)" stroke="var(--border-line)" strokeWidth="1" />
              <path d="M 45 40 Q 55 45 52 70 T 48 85 T 40 70 Z" fill="var(--bg-raise)" stroke="var(--border-line)" strokeWidth="1" />
              {/* Australia */}
              <path d="M 75 70 Q 85 70 82 85 T 75 80 Z" fill="var(--bg-raise)" stroke="var(--border-line)" strokeWidth="1" />
            </svg>

            {/* Glowing Active Pins */}
            {ACTIVE_PEER_PINS.map(pin => {
              const active = selectedRoom?.id === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => {
                    playClick();
                    setSelectedRoom(pin);
                  }}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-125 focus:outline-none"
                  style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}
                >
                  <span className="relative flex h-4 w-4">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      active ? 'bg-phase-violet' : 'bg-phase-teal'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-surface ${
                      active ? 'bg-phase-violet' : 'bg-phase-teal'
                    }`} />
                  </span>
                </button>
              );
            })}

            {/* User Filtered Coordinate Pin */}
            {userCoords && (
              <div
                className="absolute transition-all duration-500 scale-110"
                style={{ top: `${userCoords.lat}%`, left: `${userCoords.lng}%` }}
              >
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-phase-amber opacity-75" />
                  <span className="relative inline-flex rounded-full h-5 w-5 border-2 border-surface bg-phase-amber flex items-center justify-center text-[8px] font-bold text-white shadow-md">
                    U
                  </span>
                </span>
                {/* Visual label for user pin */}
                <div className="absolute top-6 -left-8 bg-surface/90 backdrop-blur border border-phase-amber/25 px-2 py-0.5 rounded text-[8px] font-mono text-phase-amber font-bold shadow-sm whitespace-nowrap">
                  You (Verified)
                </div>
              </div>
            )}
          </div>

          {/* Privacy Level status banner */}
          <div className="flex items-center justify-center gap-2 p-2.5 bg-bg-raise/50 border border-border-line rounded-xl text-[10px] font-mono text-text-dim text-center">
            <Shield size={12} className="text-phase-teal" />
            <span>
              {privacyLevel === 'invisible' 
                ? "Your location coordinates are completely invisible on the Peer Map."
                : `Location Privacy Active: Your pin is plotted at ${privacyLevel.toUpperCase()} level accuracy (${userCoords?.rawLat || '0'}, ${userCoords?.rawLng || '0'}).`
              }
            </span>
          </div>
        </div>

        {/* Sidebar Info & Live Activity Feed */}
        <div className="space-y-6">
          
          {/* Room Details Card */}
          {selectedRoom && (
            <div className="bg-surface border border-border-line rounded-2xl p-5 shadow-sm space-y-4 animate-scale-in" key={selectedRoom.id}>
              <div className="flex justify-between items-start">
                <h4 className="font-bold font-display text-base text-text-main">{selectedRoom.name}</h4>
                <span className="text-[10px] font-mono font-bold bg-phase-teal/15 text-phase-teal px-2 py-0.5 rounded-full">
                  {selectedRoom.peers} active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-text-dim">
                  <span className="font-bold text-text-main">Topic:</span> {selectedRoom.focus}
                </p>
                <p className="text-text-dim flex items-center gap-1.5">
                  <Clock size={12} className="text-text-faint" /> Timer: {selectedRoom.activeTime}
                </p>
              </div>

              <button
                onClick={() => {
                  playSuccess();
                  alert(`Connecting to ${selectedRoom.name}... Joint Pomodoro lobby synced!`);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-phase-violet hover:bg-phase-violet/90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Join Study Room <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Live Activity Stream */}
          <div className="bg-surface border border-border-line rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold font-display text-sm text-text-main flex items-center gap-2">
              <Users size={16} className="text-phase-violet" />
              Live Workspace Activity
            </h4>
            <div className="space-y-3">
              {events.map((e, idx) => (
                <div key={idx} className="text-xs text-text-dim border-l-2 border-border-line pl-3 py-0.5 leading-relaxed animate-slide-up">
                  {e}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
