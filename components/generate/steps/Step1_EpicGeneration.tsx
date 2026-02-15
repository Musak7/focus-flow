'use client';
import React, { useState } from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';
import { Sparkles, Loader2 } from 'lucide-react';

export default function Step1_EpicGeneration() {
  const { nextStep, projectData, setProjectData } = useWorkflow();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!projectData.description) return alert("Please enter a description");
    
    setLoading(true);
    try {
      // Talking to your Node.js Backend (Port 8000)
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: projectData.description }),
      });
      
      const data = await response.json();
      // Store the AI generated epics in our "Brain" (Context)
      setProjectData({ ...projectData, epics: data.epics });
      nextStep(); // Move to Step 2
    } catch (error) {
      console.error("AI Error:", error);
      alert("Backend not found. Make sure the Node.js backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Project Concept</h2>
      <textarea 
        className="w-full p-6 border border-slate-200 rounded-3xl h-48 mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 text-slate-700"
        placeholder="E.g., Build a task management app with real-time collaboration..."
        value={projectData.description}
        onChange={(e) => setProjectData({...projectData, description: e.target.value})}
      />
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        {loading ? "AI is Thinking..." : "Generate AI Backlog"}
      </button>
    </div>
  );
}