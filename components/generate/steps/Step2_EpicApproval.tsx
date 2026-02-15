'use client';
import React from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Step2_EpicApproval() {
  const { nextStep, prevStep, projectData } = useWorkflow();

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Review AI Epics</h2>
      <p className="text-slate-500 mb-8">Approve the generated modules to begin developer matching.</p>
      
      <div className="grid gap-4 mb-8">
        {projectData.epics?.map((epic: any, index: number) => (
          <div key={index} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800">{epic.title}</h4>
              <p className="text-sm text-slate-500">{epic.description}</p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Check size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={prevStep} className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 flex items-center gap-2 hover:bg-slate-50">
          <ArrowLeft size={18} /> Edit Description
        </button>
        <button onClick={nextStep} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all">
          Analyze Team Skills <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}