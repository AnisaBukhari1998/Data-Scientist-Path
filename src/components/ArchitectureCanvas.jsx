import { useState, useEffect, useRef } from 'react';
import { 
  GitFork, Database, Terminal, Cpu, Share2, Play, 
  Trash2, Plus, FileCode, CheckCircle2, RotateCcw, Download, AlertTriangle 
} from 'lucide-react';

const NODE_TYPES = [
  { type: 'source', label: 'IoT Sensors / Database', icon: Database, color: 'var(--amber)' },
  { type: 'stream', label: 'Kafka Ingestion', icon: Share2, color: 'var(--violet)' },
  { type: 'etl', label: 'Apache Spark / ETL', icon: Terminal, color: 'var(--teal)' },
  { type: 'ml', label: 'RandomForest Predictor', icon: Cpu, color: 'var(--rose)' },
  { type: 'api', label: 'FastAPI Gateway', icon: FileCode, color: 'var(--gold)' },
  { type: 'ui', label: 'React Dashboard', icon: GitFork, color: 'var(--teal)' }
];

const DEFAULT_NODES = [
  { id: 1, type: 'source', label: 'IoT Spoilage Sensors', x: 40, y: 150 },
  { id: 2, type: 'stream', label: 'Kafka Raw Stream', x: 200, y: 150 },
  { id: 3, type: 'etl', label: 'Spark Aggregator', x: 360, y: 150 },
  { id: 4, type: 'ml', label: 'Harvest Random Forest', x: 520, y: 150 },
  { id: 5, type: 'api', label: 'Predictive API Gateway', x: 680, y: 150 },
  { id: 6, type: 'ui', label: 'Guardian UI Dashboard', x: 840, y: 150 }
];

const DEFAULT_LINKS = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 }
];

export function ArchitectureCanvas() {
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('canvas-nodes');
    return saved ? JSON.parse(saved) : DEFAULT_NODES;
  });

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('canvas-links');
    return saved ? JSON.parse(saved) : DEFAULT_LINKS;
  });

  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectionSourceId, setConnectionSourceId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('canvas-nodes', JSON.stringify(nodes));
    localStorage.setItem('canvas-links', JSON.stringify(links));
  }, [nodes, links]);

  // Handle Dragging
  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggedNodeId === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setNodes(prev => prev.map(n => {
      if (n.id === draggedNodeId) {
        // Bound checks to keep node inside canvas space
        const nextX = Math.max(10, Math.min(1000, mouseX - dragOffset.x));
        const nextY = Math.max(10, Math.min(500, mouseY - dragOffset.y));
        return { ...n, x: nextX, y: nextY };
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Add custom node
  const handleAddNode = (typeInfo) => {
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 1;
    const newNode = {
      id: newId,
      type: typeInfo.type,
      label: `New ${typeInfo.label}`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
  };

  // Delete node and its connections
  const handleDeleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setLinks(prev => prev.filter(l => l.from !== nodeId && l.to !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    if (connectionSourceId === nodeId) setConnectionSourceId(null);
  };

  // Connect Nodes
  const handleConnectClick = (nodeId) => {
    if (connectionSourceId === null) {
      setConnectionSourceId(nodeId);
    } else {
      if (connectionSourceId !== nodeId) {
        // Check if connection already exists
        const exists = links.some(l => 
          (l.from === connectionSourceId && l.to === nodeId) ||
          (l.from === nodeId && l.to === connectionSourceId)
        );
        if (!exists) {
          setLinks(prev => [...prev, { from: connectionSourceId, to: nodeId }]);
        }
      }
      setConnectionSourceId(null);
    }
  };

  const handleResetCanvas = () => {
    if (confirm("Reset layout to default Harvest Guardian Capstone pipeline?")) {
      setNodes(DEFAULT_NODES);
      setLinks(DEFAULT_LINKS);
      setSelectedNodeId(null);
      setConnectionSourceId(null);
    }
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ nodes, links }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'harvest_guardian_architecture.json';
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-brick/15 rounded-xl text-phase-brick">
            <GitFork size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Pipeline Architecture Canvas</h2>
            <p className="text-text-dim text-sm">Design ETL data pipelines, model inference cycles, and system structures visually.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Blocks Toolbar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flat-card p-5 border border-border-line space-y-4">
            <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider">Drag & Add Blocks</h3>
            <div className="flex flex-col gap-2.5">
              {NODE_TYPES.map(typeInfo => {
                const Icon = typeInfo.icon;
                return (
                  <button
                    key={typeInfo.type}
                    onClick={() => handleAddNode(typeInfo)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border-line bg-surface hover:bg-surface-hover hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-bg-main" style={{ color: typeInfo.color }}>
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-text-dim">{typeInfo.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset & Export Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleResetCanvas}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border-line text-xs font-semibold bg-bg-raise text-text-dim hover:text-text-main cursor-pointer"
            >
              <RotateCcw size={12} /> Reset Canvas
            </button>
            <button
              onClick={handleExportJSON}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-phase-brick text-white hover:bg-phase-brick/90 text-xs font-bold shadow cursor-pointer"
            >
              <Download size={12} /> Export JSON
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Drawing Canvas */}
        <div className="lg:col-span-9 space-y-4">
          <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-[500px] border border-border-line rounded-2xl bg-surface relative overflow-hidden select-none cursor-crosshair shadow-inner"
            style={{
              backgroundImage: 'radial-gradient(var(--border-strong) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* SVG Layer for Drawing Line Connections */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full">
              {links.map((link, idx) => {
                const fromNode = nodes.find(n => n.id === link.from);
                const toNode = nodes.find(n => n.id === link.to);
                if (!fromNode || !toNode) return null;

                // Connection line starts from center right of 'fromNode' to center left of 'toNode'
                const startX = fromNode.x + 80;
                const startY = fromNode.y + 35;
                const endX = toNode.x + 80;
                const endY = toNode.y + 35;

                // Bezier curve calculations for smooth pipeline connection lines
                const dx = Math.abs(endX - startX) * 0.5;
                const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill="none"
                    stroke="var(--violet)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-70 animate-pulse-glow"
                  />
                );
              })}
            </svg>

            {/* Render Nodes */}
            {nodes.map(n => {
              const typeInfo = NODE_TYPES.find(t => t.type === n.type);
              const Icon = typeInfo?.icon || GitFork;
              const isSelected = selectedNodeId === n.id;
              const isConnectionSource = connectionSourceId === n.id;

              return (
                <div
                  key={n.id}
                  onMouseDown={(e) => handleMouseDown(e, n.id)}
                  style={{ left: n.x, top: n.y }}
                  className={`absolute w-40 p-3 bg-surface border rounded-xl flex flex-col gap-2 shadow-lg transition-shadow cursor-grab active:cursor-grabbing ${
                    isSelected ? 'border-phase-brick ring-2 ring-phase-brick/20' : 'border-border-line'
                  } ${isConnectionSource ? 'border-phase-violet ring-2 ring-phase-violet/20' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1 rounded-lg" style={{ backgroundColor: `${typeInfo?.color}15`, color: typeInfo?.color }}>
                      <Icon size={14} />
                    </div>
                    <span className="text-[8px] font-mono uppercase text-text-faint">ID: {n.id}</span>
                  </div>

                  <input
                    type="text"
                    value={n.label}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes(prev => prev.map(item => item.id === n.id ? { ...item, label: val } : item));
                    }}
                    className="w-full bg-transparent text-[11px] font-bold text-text-main focus:outline-none focus:border-b border-border-line select-text"
                  />

                  {/* Actions inside node card */}
                  <div className="flex justify-between items-center pt-2 border-t border-border-line">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleConnectClick(n.id); }}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                        isConnectionSource
                          ? 'bg-phase-violet text-white'
                          : 'bg-bg-raise text-text-dim hover:text-text-main'
                      }`}
                      title="Link connection line to another node"
                    >
                      {isConnectionSource ? 'Linking...' : 'Connect'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteNode(n.id); }}
                      className="text-text-faint hover:text-phase-brick transition-colors cursor-pointer"
                      title="Delete block"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Alert */}
          <div className="flat-card p-4 border border-border-line bg-surface flex gap-3 items-start text-xs text-text-dim leading-relaxed">
            <AlertTriangle size={16} className="text-phase-amber flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-main">Architecture Canvas Guide</span>: 
              Drag blocks to position them in your data pipeline. Click **Connect** on a source block, then click **Connect** on a destination block to draw data pathways. Export your pipeline configuration in JSON format.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
