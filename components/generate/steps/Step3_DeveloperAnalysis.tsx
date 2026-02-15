'use client';
import React from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';

export default function Step3_DeveloperAnalysis() {
  const { nextStep, prevStep } = useWorkflow();
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Step 3: Developer Skill Analysis</h2>
      <p className="text-slate-500 mb-6">Scanning team performance metrics and skill profiles...</p>
      <div className="flex gap-4">
        <button onClick={prevStep} className="px-6 py-2 border rounded-xl">Back</button>
        <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Final Assignment</button>
      </div>
    </div>
  );
}