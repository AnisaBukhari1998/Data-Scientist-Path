import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PHASES } from '../data/roadmap';
import { PhaseCard } from './PhaseCard';

export function PhaseDetail() {
  const { phaseId } = useParams();
  
  const phase = PHASES.find(p => p.key === phaseId);
  
  if (!phase) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link to="/" className="inline-flex items-center p-2 -ml-2 rounded-xl text-text-dim hover:bg-bg-raise hover:text-text-main font-medium transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Roadmap
      </Link>
      
      <PhaseCard phase={phase} />
    </div>
  );
}
