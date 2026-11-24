import { useState } from 'react';
import { Target, Lock, CheckCircle2, Award, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { SKILLS_DATA } from '../data/skills';
import { PHASES } from '../data/roadmap';

// One circle per roadmap phase (labels match src/data/roadmap.js).
// dataIdx is the matching entry in SKILLS_DATA.
const NEURAL_NODES = [
  { id: 'phase1', layer: 0, label: 'Foundations', subLabel: 'Python, SQL & Stats', x: 100, y: 175,
    color: 'var(--teal)', colorClass: 'text-phase-teal bg-phase-teal/15 border-phase-teal/30', dataIdx: 0 },
  { id: 'phase2', layer: 1, label: 'Core ML', subLabel: 'Classical ML', x: 280, y: 175,
    color: 'var(--amber)', colorClass: 'text-phase-amber bg-phase-amber/15 border-phase-amber/30', dataIdx: 1 },
  { id: 'phase3', layer: 2, label: 'Deep Learning', subLabel: '& Deployment', x: 470, y: 90,
    color: 'var(--violet)', colorClass: 'text-phase-violet bg-phase-violet/15 border-phase-violet/30', dataIdx: 2 },
  { id: 'phase4', layer: 2, label: 'Capstone', subLabel: '& Job Readiness', x: 470, y: 260,
    color: 'var(--brick)', colorClass: 'text-phase-brick bg-phase-brick/15 border-phase-brick/30', dataIdx: 3 },
  { id: 'phase5', layer: 3, label: 'AI Engineering', subLabel: 'MLOps & GenAI', x: 680, y: 175,
    color: 'var(--rose)', colorClass: 'text-phase-rose bg-phase-rose/15 border-phase-rose/30', dataIdx: 4 },
];

// Lines show what builds on what.
const SYNAPSES = [
  { from: 'phase1', to: 'phase2' },
  { from: 'phase2', to: 'phase3' },
  { from: 'phase2', to: 'phase4' },
  { from: 'phase3', to: 'phase5' },
  { from: 'phase4', to: 'phase5' }
];

export function SkillTree() {
  const { progress } = useProgress();
  const [selectedNodeId, setSelectedNodeId] = useState('phase1');

  // Helper helper functions to evaluate state
  const getPhaseState = (nodeId, dataIdx) => {
    const phaseKey = SKILLS_DATA[dataIdx]?.phaseId || 'phase1';
    const phaseProgress = progress[phaseKey] || {};
    const isQuizPassed = phaseProgress.quizPassed;

    let completedItems = 0;
    ['courses', 'books', 'videos', 'websites', 'projects', 'certs'].forEach(cat => {
      if (phaseProgress[cat]) {
        completedItems += phaseProgress[cat].length;
      }
    });

    let isUnlocked = false;
    if (dataIdx === 0) {
      isUnlocked = true;
    } else {
      const prevPhaseKey = SKILLS_DATA[dataIdx - 1]?.phaseId;
      const prevPassed = progress[prevPhaseKey]?.quizPassed;
      isUnlocked = prevPassed || completedItems > 0;
    }

    return { isUnlocked, isQuizPassed };
  };

  const selectedNode = NEURAL_NODES.find(n => n.id === selectedNodeId) || NEURAL_NODES[0];
  const selectedPhaseGroup = SKILLS_DATA[selectedNode.dataIdx] || SKILLS_DATA[0];
  const selectedState = getPhaseState(selectedNode.id, selectedNode.dataIdx);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-surface rounded-2xl mb-2 shadow-sm border border-border-line">
          <Target size={36} className="text-phase-violet animate-float" />
        </div>
        <h1 className="text-3xl font-bold font-display text-text-main">Neural Network Skill Tree</h1>
        <p className="text-sm text-text-dim max-w-xl mx-auto">
          Interactive deep learning network model. Select nodes to inspect core curriculum skills.
        </p>
      </header>

      {/* SVG Neural Network Diagram */}
      <div className="flat-card p-6 border border-border-line bg-surface relative shadow-sm overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px] h-[350px] relative">
          <svg className="w-full h-full" viewBox="0 0 800 350">
            {/* Draw Synapses (Connections) */}
            {SYNAPSES.map((syn, idx) => {
              const fromNode = NEURAL_NODES.find(n => n.id === syn.from);
              const toNode = NEURAL_NODES.find(n => n.id === syn.to);
              if (!fromNode || !toNode) return null;

              const fromState = getPhaseState(fromNode.id, fromNode.dataIdx);
              const isSynapseActive = fromState.isUnlocked || fromState.isQuizPassed;

              return (
                <g key={`syn-${idx}`}>
                  {/* Background base connector line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="var(--line-strong)"
                    strokeWidth={2}
                    className="opacity-40"
                  />
                  {/* Glowing moving signals for unlocked connections */}
                  {isSynapseActive && (
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={fromNode.color}
                      strokeWidth={2}
                      strokeDasharray="6,6"
                      className="animate-dash"
                      style={{
                        filter: `drop-shadow(0 0 3px ${fromNode.color})`,
                        animation: 'synapseFlow 15s linear infinite'
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Draw Neurons (Nodes) */}
            {NEURAL_NODES.map((node) => {
              const nodeState = getPhaseState(node.id, node.dataIdx);
              const active = selectedNodeId === node.id;
              const completed = nodeState.isQuizPassed;
              const unlocked = nodeState.isUnlocked;

              // Soft pastel nodes color styles
              const strokeColor = completed ? node.color : unlocked ? node.color : 'var(--text-faint)';
              const fillColor = completed ? node.color : active ? 'var(--surface-hover)' : 'var(--surface)';
              const glow = active ? `drop-shadow(0 0 10px ${node.color})` : completed ? `drop-shadow(0 0 5px ${node.color}40)` : '';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                  style={{ filter: glow }}
                >
                  {/* Ripple pulse ring for selected/active nodes */}
                  {active && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={30}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={1.5}
                      className="animate-ping opacity-25"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                  )}
                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={22}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={active ? 3 : 2}
                    className="transition-all duration-300 group-hover:scale-110"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                  {/* Status indicator inside node */}
                  {completed ? (
                    <CheckCircle2
                      size={14}
                      className="text-bg-main"
                      x={node.x - 7}
                      y={node.y - 7}
                    />
                  ) : !unlocked ? (
                    <Lock
                      size={12}
                      className="text-text-faint"
                      x={node.x - 6}
                      y={node.y - 6}
                    />
                  ) : (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={4}
                      fill={node.color}
                    />
                  )}
                  {/* Node Texts */}
                  <text
                    x={node.x}
                    y={node.y - 30}
                    textAnchor="middle"
                    className="text-[11px] font-bold font-display fill-text-main"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 36}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-text-faint uppercase tracking-wider"
                  >
                    {node.subLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Node Details Panel */}
      <div className="animate-slide-up" key={selectedNodeId}>
        <div className={`flat-card p-6 border border-border-line space-y-6 shadow-sm`}>
          {/* Node Meta Title */}
          <div className="flex items-center justify-between border-b border-border-line pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${selectedNode.colorClass}`}>
                <Zap size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-text-main">{selectedPhaseGroup.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono bg-bg-raise border border-border-line text-text-dim px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {PHASES.find(p => p.key === selectedPhaseGroup.phaseId)?.months}
                  </span>
                  {selectedState.isQuizPassed ? (
                    <span className="text-[10px] font-mono font-bold text-phase-gold bg-phase-gold/10 px-2 py-0.5 rounded-md border border-phase-gold/25 flex items-center gap-1">
                      <Award size={10} /> Mastered
                    </span>
                  ) : selectedState.isUnlocked ? (
                    <span className="text-[10px] font-mono font-bold text-phase-teal bg-phase-teal/10 px-2 py-0.5 rounded-md border border-phase-teal/25">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-text-faint bg-bg-raise px-2 py-0.5 rounded-md border border-border-line">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Skills Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider">Skills to Acquire</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPhaseGroup.skills.map(skill => (
                <div
                  key={skill.id}
                  className={`p-4 rounded-xl border flex flex-col gap-1 transition-all duration-200 hover:-translate-y-0.5 ${
                    selectedState.isUnlocked 
                      ? 'border-border-line bg-bg-raise hover:border-phase-violet/30 hover:bg-surface' 
                      : 'border-transparent bg-bg-raise/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-main">{skill.name}</span>
                    {selectedState.isQuizPassed && <CheckCircle2 size={14} className="text-phase-teal" />}
                  </div>
                  <span className="text-xs text-text-dim leading-relaxed">{skill.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Inline styles for Synapses dynamic animations */}
      <style>{`
        @keyframes synapseFlow {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
