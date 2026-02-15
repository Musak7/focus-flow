'use client';

import React from 'react';
import Link from 'next/link';
// Ensure lucide-react is installed: npm install lucide-react
import { Plus } from 'lucide-react';
// Relative path to your lib folder
import { MOCK_PROJECTS } from '../../lib/api';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Projects
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Select a project to view the Smart Dashboard or start a new AI-powered workflow.
          </p>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. Map through existing mock projects */}
          {MOCK_PROJECTS.map((project) => (
            <Link key={project.id} href="/dashboard">
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-xl group h-72 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h2>
                  </div>
                  <p className="text-slate-500 text-sm font-semibold bg-slate-50 inline-block px-3 py-1 rounded-full">
                    {project.currentSprint}
                  </p>
                </div>

                {/* Health Bar Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Sprint Health
                    </span>
                    <span className={`text-sm font-bold ${project.healthScore > 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {project.healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${
                        project.healthScore > 70 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${project.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* 2. THE NEW PROJECT CARD (Links to the AI Architect) */}
          <Link href="/projects/generate">
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 hover:bg-white hover:border-blue-400 transition-all cursor-pointer h-72 flex flex-col items-center justify-center text-slate-400 group shadow-sm hover:shadow-md">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">
                <Plus size={40} strokeWidth={2.5} />
              </div>
              <span className="font-black text-slate-600 uppercase tracking-widest text-xs">
                New Project
              </span>
              <p className="text-[11px] font-medium mt-2 text-slate-400 text-center px-6 leading-relaxed italic">
                Launch AI Requirements Engine & Team Assignment
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}