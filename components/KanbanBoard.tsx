// components/KanbanBoard.tsx
"use client";
import React from 'react';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-blue-400' },
  { id: 'inprogress', title: 'In Progress', color: 'bg-amber-400' },
  { id: 'done', title: 'Done', color: 'bg-emerald-400' },
];

const mockTasks = [
  { id: 'PROJ-1', title: 'Setup project architecture', status: 'done', priority: 'High' },
  { id: 'PROJ-2', title: 'Implement Dashboard UI', status: 'inprogress', priority: 'Medium' },
  { id: 'PROJ-3', title: 'Jira API Integration', status: 'todo', priority: 'High' },
];

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {columns.map((col) => (
        <div key={col.id} className="bg-slate-50/50 rounded-2xl p-4 min-h-[250px] border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{col.title}</h3>
          </div>
          <div className="space-y-3">
            {mockTasks.filter(t => t.status === col.id).map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <span className="text-[10px] font-bold text-blue-600 uppercase">{task.id}</span>
                <p className="text-sm font-semibold text-slate-700 leading-tight mt-1">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}