'use client';
import React from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';
import { useRouter } from 'next/navigation';

export default function Step4_Assignment() {
  const router = useRouter();
  const { prevStep } = useWorkflow();
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Step 4: AI Recommendations</h2>
      <p className="text-slate-500 mb-6">The best developer matches for your project tasks have been identified.</p>
      <div className="flex gap-4">
        <button onClick={prevStep} className="px-6 py-2 border rounded-xl">Back</button>
        <button 
          onClick={() => router.push('/projects')}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Finish & Create Project
        </button>
      </div>
    </div>
  );
}