// app/dashboard/page.tsx
import React from 'react';
import { BurndownChart } from '../../components/Dashboard/BurndownChart';
import { HealthScore } from '../../components/Dashboard/HealthScore';
import KanbanBoard from '../../components/KanbanBoard'; // Notice: No braces for default export

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Focus Flow Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">Sprint Overview & Health Monitoring</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm">Generate Reports</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <BurndownChart />
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Sprint Tasks</h3>
            <KanbanBoard />
          </div>
        </div>

        <div className="space-y-8">
          <HealthScore score={85} />
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Team Members</h3>
            <div className="space-y-4">
              {["Abdul Ahad", "Moiz Khan", "Musa Khan"].map(name => (
                <p key={name} className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> {name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}