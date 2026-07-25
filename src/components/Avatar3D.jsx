import React, { useState, useEffect, useRef } from 'react';

// Helper component to render a 3D Cuboid using pure CSS 3D transforms
function Cuboid({ 
  width, height, depth, 
  x = 0, y = 0, z = 0, 
  rx = 0, ry = 0, rz = 0,
  colors = {}, 
  className = "",
  children = null
}) {
  const w = parseFloat(width);
  const h = parseFloat(height);
  const d = parseFloat(depth);

  // Set default colors or use base color
  const baseColor = typeof colors === 'string' ? colors : (colors.front || '#ccc');
  const faces = {
    front: colors.front || baseColor,
    back: colors.back || adjustColorBrightness(baseColor, -20),
    left: colors.left || adjustColorBrightness(baseColor, -15),
    right: colors.right || adjustColorBrightness(baseColor, -10),
    top: colors.top || adjustColorBrightness(baseColor, 15),
    bottom: colors.bottom || adjustColorBrightness(baseColor, -30),
  };

  return (
    <div 
      className={`absolute ${className}`}
      style={{
        width: w,
        height: h,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front Face */}
      <div 
        className="absolute inset-0 select-none overflow-hidden"
        style={{
          width: w,
          height: h,
          backgroundColor: faces.front,
          transform: `translate3d(0, 0, ${d / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Back Face */}
      <div 
        className="absolute inset-0 select-none"
        style={{
          width: w,
          height: h,
          backgroundColor: faces.back,
          transform: `rotateY(180deg) translate3d(0, 0, ${d / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Left Face */}
      <div 
        className="absolute top-0 bottom-0 select-none"
        style={{
          width: d,
          height: h,
          left: `calc(50% - ${d / 2}px)`,
          backgroundColor: faces.left,
          transform: `rotateY(-90deg) translate3d(0, 0, ${w / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Right Face */}
      <div 
        className="absolute top-0 bottom-0 select-none"
        style={{
          width: d,
          height: h,
          left: `calc(50% - ${d / 2}px)`,
          backgroundColor: faces.right,
          transform: `rotateY(90deg) translate3d(0, 0, ${w / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Top Face */}
      <div 
        className="absolute left-0 right-0 select-none"
        style={{
          width: w,
          height: d,
          top: `calc(50% - ${d / 2}px)`,
          backgroundColor: faces.top,
          transform: `rotateX(90deg) translate3d(0, 0, ${h / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Bottom Face */}
      <div 
        className="absolute left-0 right-0 select-none"
        style={{
          width: w,
          height: d,
          top: `calc(50% - ${d / 2}px)`,
          backgroundColor: faces.bottom,
          transform: `rotateX(-90deg) translate3d(0, 0, ${h / 2}px)`,
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
}

export function Avatar3D({ config, size = 120, interactive = false, className = "" }) {
  const activeConfig = config || {
    skinColor: '#fbd3c3',
    eyes: 'happy',
    hair: 'sleek',
    clothing: 'hoodie',
    accessory: 'glasses',
    bgGradient: 'aurora'
  };

  const { skinColor, eyes, hair, clothing, accessory, bgGradient } = activeConfig;

  // Background ring configurations
  const bgGradients = {
    aurora: 'linear-gradient(45deg, #7bc8c4, #9b8ec4)',
    cyberpunk: 'linear-gradient(135deg, #d4849a, #e8a87c)',
    teal: 'linear-gradient(90deg, #4fd1c5, #2b6cb0)',
    gold: 'linear-gradient(60deg, #d4b87c, #c490b0)',
    sunset: 'linear-gradient(180deg, #f56565, #ed64a6)',
    cool: 'linear-gradient(45deg, #1a1726, #2a2640)'
  };

  const bgStyle = bgGradients[bgGradient] || bgGradients.aurora;

  // Outfit base colors
  const clothingColors = {
    hoodie: '#9b8ec4',
    tshirt: '#2d3748',
    blazer: '#2b6cb0',
    sweater: '#e8a87c'
  };

  const clothColor = clothingColors[clothing] || clothingColors.hoodie;

  // Rotation controls
  const [rotation, setRotation] = useState({ x: -12, y: 25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Handle Drag-to-Rotate (Interactive Mode)
  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setRotation(prev => ({
      x: Math.min(30, Math.max(-30, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll to Spin (Interactive Mode)
  useEffect(() => {
    if (!interactive) return;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault(); // Stop window from scrolling
      const delta = e.deltaY * 0.2; // Scale scroll to rotation speed
      setRotation(prev => ({
        ...prev,
        y: prev.y + delta
      }));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [interactive]);

  // Auto-Spin animation for non-interactive displays
  useEffect(() => {
    if (interactive) return;
    let frameId;
    let angle = 25;
    const animate = () => {
      angle += 0.45; // Smooth slow spin speed
      setRotation(prev => ({ ...prev, y: angle }));
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [interactive]);

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden flex items-center justify-center select-none shadow-md ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: bgStyle,
        cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'default',
        perspective: '600px'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 border border-white/15 rounded-3xl pointer-events-none z-20" />

      {/* 3D Scene Root */}
      <div 
        className="relative flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          width: '100%',
          height: '100%',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shadow Plane */}
        <div 
          className="absolute rounded-full bg-black/25 blur-md"
          style={{
            width: '60px',
            height: '60px',
            transform: 'rotateX(90deg) translate3d(0, 0, -42px)',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* ── 3D Pedestal Platform ── */}
        <Cuboid 
          width="76" height="6" depth="76"
          y={40}
          colors={{
            top: '#1a1726',
            front: '#211e30',
            left: '#211e30',
            right: '#211e30',
            back: '#211e30',
            bottom: '#100e18'
          }}
        />

        {/* ── 3D Neck ── */}
        <Cuboid 
          width="10" height="12" depth="10"
          y={2}
          colors={skinColor}
        />

        {/* ── 3D Torso (Chest/Shoulders) ── */}
        <Cuboid 
          width="42" height="34" depth="20"
          y={22}
          colors={clothColor}
        >
          {/* Inner clothing details mapped onto Front Face */}
          <div className="w-full h-full flex flex-col items-center justify-start pt-1.5 relative">
            {clothing === 'blazer' && (
              <>
                {/* White Shirt Collar V */}
                <div className="w-6 h-4 bg-white clip-v" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                {/* Red Tie */}
                <div className="w-2 h-10 bg-red-600 absolute top-4 rounded-b-sm" />
              </>
            )}
            {clothing === 'tshirt' && (
              <>
                {/* Crew Neckline */}
                <div className="w-8 h-2 bg-black/20 rounded-b-full" />
                {/* Glow Symbol */}
                <div className="w-3 h-3 bg-teal-400/30 border border-teal-400 rounded-full mt-3 animate-pulse" />
              </>
            )}
            {clothing === 'sweater' && (
              <>
                {/* Knit collar ribbed lines */}
                <div className="w-10 h-3 border-b-2 border-dashed border-orange-700/40" />
              </>
            )}
            {clothing === 'hoodie' && (
              <>
                {/* Hoodie Neck V */}
                <div className="w-7 h-3 bg-black/25 rounded-b-xl" />
                {/* White Strings */}
                <div className="flex gap-2.5 mt-0.5">
                  <div className="w-0.5 h-6 bg-slate-300 rounded-full" />
                  <div className="w-0.5 h-6 bg-slate-300 rounded-full" />
                </div>
              </>
            )}
          </div>
        </Cuboid>

        {/* ── 3D Left Arm ── */}
        <Cuboid 
          width="10" height="30" depth="10"
          x={-26} y={20}
          colors={clothColor}
        />

        {/* ── 3D Right Arm ── */}
        <Cuboid 
          width="10" height="30" depth="10"
          x={26} y={20}
          colors={clothColor}
        />

        {/* ── 3D Head ── */}
        <Cuboid 
          width="32" height="32" depth="32"
          y={-18}
          colors={skinColor}
        >
          {/* Head Front Face containing Eyes, Smile, and Glasses */}
          <div className="w-full h-full p-2 flex flex-col justify-between items-center relative bg-transparent">
            {/* 1. Expression / Eyes */}
            <div className="flex justify-between w-full px-2 mt-3">
              {eyes === 'happy' && (
                <>
                  <div className="w-2.5 h-1 border-t-2 border-black rounded-t-full rotate-12" />
                  <div className="w-2.5 h-1 border-t-2 border-black rounded-t-full -rotate-12" />
                </>
              )}
              {eyes === 'determined' && (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-0.5 bg-black rotate-12 mb-0.5" />
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-0.5 bg-black -rotate-12 mb-0.5" />
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </div>
                </>
              )}
              {eyes === 'cool' && (
                <div className="w-full h-4 bg-zinc-900 border-b border-zinc-700 rounded-sm flex items-center justify-around absolute left-0 right-0 top-2.5 z-10 px-1 shadow-md">
                  <div className="w-3.5 h-2.5 bg-white/20 transform skew-x-12" />
                  <div className="w-3.5 h-2.5 bg-white/20 transform skew-x-12" />
                </div>
              )}
              {eyes === 'coding' && (
                <div className="flex justify-between w-full absolute left-0 right-0 top-3 px-1 z-10">
                  <div className="w-5 h-3.5 bg-teal-900/60 border border-teal-400 rounded-sm flex items-center justify-center text-[5px] text-teal-300 font-mono font-bold leading-none">10</div>
                  <div className="w-5 h-3.5 bg-teal-900/60 border border-teal-400 rounded-sm flex items-center justify-center text-[5px] text-teal-300 font-mono font-bold leading-none">01</div>
                </div>
              )}
              {eyes === 'sleepy' && (
                <>
                  <div className="w-3 h-0.5 bg-zinc-700 mt-1" />
                  <div className="w-3 h-0.5 bg-zinc-700 mt-1" />
                </>
              )}
              {eyes === 'focused' && (
                <>
                  <div className="w-2 h-2 bg-zinc-900 rounded-full flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                  <div className="w-2 h-2 bg-zinc-900 rounded-full flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                </>
              )}
            </div>

            {/* 2. Glass Specs Frame Accessory */}
            {accessory === 'glasses' && eyes !== 'cool' && eyes !== 'coding' && (
              <div className="absolute inset-x-1 top-2.5 flex justify-between z-10 pointer-events-none">
                <div className="w-5 h-5 border-2 border-black rounded-full" />
                <div className="w-1.5 h-0.5 bg-black mt-2" />
                <div className="w-5 h-5 border-2 border-black rounded-full" />
              </div>
            )}

            {/* 3. Mouth */}
            <div className="mb-2">
              {eyes === 'sleepy' ? (
                <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
              ) : (
                <div className="w-4 h-1.5 border-b-2 border-zinc-800 rounded-b-full" />
              )}
            </div>
          </div>
        </Cuboid>

        {/* ── 3D Hair Block (Layered on Top/Back/Sides of head) ── */}
        {hair !== 'none' && (
          <>
            {/* Top Hair Cap */}
            <Cuboid 
              width="34" height="10" depth="34"
              y={-34}
              colors={hair === 'messy' ? '#e2b13c' : '#4a3728'}
            />
            {/* Back Hair plate */}
            <Cuboid 
              width="34" height="24" depth="6"
              y={-22} z={-15}
              colors={hair === 'messy' ? '#e2b13c' : '#4a3728'}
            />
            {/* Left Side Sideburn */}
            <Cuboid 
              width="4" height="18" depth="30"
              x={-15} y={-23}
              colors={hair === 'messy' ? '#e2b13c' : '#3d2b1f'}
            />
            {/* Right Side Sideburn */}
            <Cuboid 
              width="4" height="18" depth="30"
              x={15} y={-23}
              colors={hair === 'messy' ? '#e2b13c' : '#3d2b1f'}
            />
          </>
        )}

        {/* ── 3D Snapback Cap Brim Accessory ── */}
        {hair === 'cap' && (
          <Cuboid 
            width="34" height="4" depth="14"
            y={-30} z={20}
            colors="#319795"
          />
        )}

        {/* ── 3D Over-Ear Headphones Accessory ── */}
        {hair === 'headphones' && (
          <>
            {/* Headset Band Arc */}
            <Cuboid 
              width="36" height="4" depth="8"
              y={-35}
              colors="#1a202c"
            />
            {/* Left Cup */}
            <Cuboid 
              width="6" height="16" depth="12"
              x={-18} y={-18}
              colors="#9b8ec4"
            />
            {/* Right Cup */}
            <Cuboid 
              width="6" height="16" depth="12"
              x={18} y={-18}
              colors="#9b8ec4"
            />
          </>
        )}

        {/* ── 3D Knit Beanie Cap Brim ── */}
        {hair === 'beanie' && (
          <Cuboid 
            width="35" height="6" depth="35"
            y={-32}
            colors="#c2510b"
          />
        )}

        {/* ── 3D Floating Halo Accessory ── */}
        {accessory === 'halo' && (
          <div 
            className="absolute animate-pulse"
            style={{
              transform: 'translate3d(0, -45px, 0) rotateX(75deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 3D Ring using nested borders/lines */}
            <div className="w-14 h-14 rounded-full border-4 border-amber-300 shadow-[0_0_15px_rgba(251,211,141,0.8)]" />
          </div>
        )}

        {/* ── 3D Coffee Cup Badge Accessory (Held by character) ── */}
        {accessory === 'coffee' && (
          <Cuboid 
            width="10" height="12" depth="10"
            x={15} y={15} z={15}
            colors={{
              top: '#fff',
              front: '#dd6b20',
              left: '#dd6b20',
              right: '#dd6b20',
              back: '#dd6b20'
            }}
          >
            {/* Coffee inside */}
            <div className="absolute inset-1 bg-[#6f4e37] rounded-sm" />
          </Cuboid>
        )}
      </div>
    </div>
  );
}

// Helper function to adjust hex color brightness
function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
