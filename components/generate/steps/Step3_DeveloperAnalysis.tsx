'use client';
import React, { useState } from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Step3_DeveloperAnalysis() {
  const { nextStep, prevStep, projectData, setProjectData } = useWorkflow();
  const [developers] = useState([
    { name: 'John Doe', username: 'johndoe', skills: ['React', 'Node.js', 'TypeScript'] },
    { name: 'Jane Smith', username: 'janesmith', skills: ['Python', 'Django', 'PostgreSQL'] },
    { name: 'Bob Johnson', username: 'bobjohnson', skills: ['Vue.js', 'Express', 'MongoDB'] }
  ]);
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleDeveloper = (username: string) => {
    setSelectedDevs(prev =>
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };

  const handleAnalyzeAndAssign = async () => {
    if (selectedDevs.length === 0) {
      alert('Please select at least one developer');
      return;
    }

    setLoading(true);
    try {
      const selectedDevelopers = developers.filter(d => selectedDevs.includes(d.username));

      // Try to call backend for auto-assignment
      try {
        const response = await fetch('http://localhost:8000/api/auto-assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            epics: projectData.epics,
            developers: selectedDevelopers
          })
        });

        if (response.ok) {
          const data = await response.json();
          setProjectData({
            ...projectData,
            assignments: data.assignments || [],
            selectedDevelopers: selectedDevelopers
          });
        } else {
          throw new Error('Backend assignment failed');
        }
      } catch (error) {
        console.log('Using fallback assignment logic');
        // Fallback: Simple round-robin assignment
        const simpleAssignments = projectData.epics.map((epic: any, index: number) => ({
          epicId: epic.id,
          epic: epic,
          developer: selectedDevelopers[index % selectedDevelopers.length],
          reason: 'Round-robin assignment'
        }));

        setProjectData({
          ...projectData,
          assignments: simpleAssignments,
          selectedDevelopers: selectedDevelopers
        });
      }

      nextStep();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Select Team Members</h2>
      <p className="text-slate-500 mb-8">Choose developers who will work on this project</p>

      <div className="grid gap-4 mb-8">
        {developers.map((dev) => (
          <div
            key={dev.username}
            onClick={() => toggleDeveloper(dev.username)}
            className={`bg-white border-2 ${
              selectedDevs.includes(dev.username)
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200'
            } p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">{dev.name}</h4>
                <p className="text-sm text-slate-500">@{dev.username}</p>
                <div className="flex gap-2 mt-2">
                  {dev.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedDevs.includes(dev.username)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-slate-300'
              }`}>
                {selectedDevs.includes(dev.username) && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 flex items-center gap-2 hover:bg-slate-50"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={handleAnalyzeAndAssign}
          disabled={loading || selectedDevs.length === 0}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing...
            </>
          ) : (
            <>
              Analyze & Assign <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}