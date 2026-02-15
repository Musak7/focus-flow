'use client';
import React, { useState } from 'react';
import { useWorkflow } from '../../../context/WorkflowContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, Loader2, CheckCircle2 } from 'lucide-react';

export default function Step4_Assignment() {
  const router = useRouter();
  const { prevStep, projectData } = useWorkflow();
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState('');

  const handleCreateProject = async () => {
    setCreating(true);
    setStatus('Creating Jira tickets...');

    try {
      // Create Jira tickets for all epics with assignments
      const jiraResponse = await fetch('/api/jira/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectData.description,
          epics: projectData.epics,
          assignments: projectData.assignments
        })
      });

      if (!jiraResponse.ok) {
        throw new Error('Failed to create Jira tickets');
      }

      const jiraResult = await jiraResponse.json();
      setStatus(`✅ Created ${jiraResult.tickets?.length || 0} Jira tickets!`);

      // Save project to our system
      setStatus('Saving project...');
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectData.description.substring(0, 50),
          description: projectData.description,
          epics: projectData.epics,
          assignments: projectData.assignments,
          jiraTickets: jiraResult.tickets
        })
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to save project');
      }

      const projectResult = await projectResponse.json();
      const projectId = projectResult.project.id;

      setStatus(`✅ Project created successfully!`);

      // Wait a moment to show success message, then redirect to project dashboard
      setTimeout(() => {
        router.push(`/dashboard?projectId=${projectId}`);
      }, 1500);

    } catch (error: any) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please check your connection.');
      setCreating(false);
      setStatus('');
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Review Assignments</h2>
      <p className="text-slate-500 mb-8">AI has assigned epics to your team members based on their skills</p>

      {/* Assignments Grid */}
      <div className="grid gap-4 mb-8">
        {projectData.assignments?.map((assignment: any, index: number) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-1">
                  {assignment.epic?.title || assignment.epicTitle || 'Epic ' + (index + 1)}
                </h4>
                <p className="text-sm text-slate-500 mb-3">
                  {assignment.epic?.description || 'No description'}
                </p>
                {assignment.reason && (
                  <p className="text-xs text-blue-600 italic">{assignment.reason}</p>
                )}
              </div>
              <div className="ml-4 flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">
                    {assignment.developer?.name || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-500">
                    @{assignment.developer?.username || 'unknown'}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {(assignment.developer?.name || 'U').charAt(0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Message */}
      {status && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-700">
            {creating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span className="font-medium">{status}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={prevStep}
          disabled={creating}
          className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={handleCreateProject}
          disabled={creating}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg"
        >
          {creating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating Project...
            </>
          ) : (
            <>
              <Rocket size={18} />
              Create Project & Jira Tickets
            </>
          )}
        </button>
      </div>
    </div>
  );
}
