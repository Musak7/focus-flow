'use client';
import React from 'react';
import { useWorkflow } from '@/context/WorkflowContext';
import { Sparkles, CheckCircle, Users, Target } from 'lucide-react';

const steps = [
  { id: 1, label: 'Generation', icon: Sparkles },
  { id: 2, label: 'Approval', icon: CheckCircle },
  { id: 3, label: 'Analysis', icon: Users },
  { id: 4, label: 'Assignment', icon: Target },
];

export default function ProgressStepper() {
  const { currentStep } = useWorkflow();

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep >= step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}