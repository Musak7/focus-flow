'use client';
import React from 'react';
import { WorkflowProvider, useWorkflow } from '@/context/WorkflowContext';
import ProgressStepper from '@/components/generate/ProgressStepper';

// Imports using the @ alias
import Step1_EpicGeneration from '@/components/generate/steps/Step1_EpicGeneration';
import Step2_EpicApproval from '@/components/generate/steps/Step2_EpicApproval';
import Step3_DeveloperAnalysis from '@/components/generate/steps/Step3_DeveloperAnalysis';
import Step4_Assignment from '@/components/generate/steps/Step4_Assignment';

function StepContent() {
  const { currentStep } = useWorkflow();
  switch (currentStep) {
    case 1: return <Step1_EpicGeneration />;
    case 2: return <Step2_EpicApproval />;
    case 3: return <Step3_DeveloperAnalysis />;
    case 4: return <Step4_Assignment />;
    default: return <Step1_EpicGeneration />;
  }
}

export default function GenerateProjectPage() {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight uppercase text-slate-800">AI Project Architect</h1>
            <p className="text-slate-500 text-sm font-medium">Requirements to Team Assignment in minutes</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
            <ProgressStepper />
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
            <StepContent />
          </div>
        </div>
      </div>
    </WorkflowProvider>
  );
}