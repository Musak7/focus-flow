'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Projects
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {projects.length > 0
              ? 'Select a project to view details or create a new one'
              : 'Create a new project to start your AI-powered workflow'}
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Existing Projects */}
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard?projectId=${project.id}`}>
                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-xl group h-72 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">
                      {project.description}
                    </p>
                    <p className="text-slate-500 text-sm font-semibold bg-slate-50 inline-block px-3 py-1 rounded-full">
                      {project.currentSprint || 'Sprint 1'}
                    </p>
                    <div className="mt-3 text-xs text-slate-400">
                      {project.jiraTickets?.length || 0} tickets • Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Health Bar Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Sprint Health
                      </span>
                      <span className={`text-sm font-bold ${project.healthScore > 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {project.healthScore || 85}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${
                          (project.healthScore || 85) > 70 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${project.healthScore || 85}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create New Project Card */}
            <Link href="/projects/generate">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-[2.5rem] p-12 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-500 transition-all cursor-pointer h-80 flex flex-col items-center justify-center group shadow-lg hover:shadow-2xl">
              <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Plus size={48} strokeWidth={3} />
              </div>
              <span className="font-black text-blue-900 uppercase tracking-widest text-lg mb-3">
                Create New Project
              </span>
              <p className="text-sm font-medium text-blue-700 text-center px-6 leading-relaxed">
                Launch AI Requirements Engine & Team Assignment
              </p>
            </div>
          </Link>

          </div>
        )}
      </div>
    </div>
  );
}