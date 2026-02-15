"use client";
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function HealthScore({ score }: { score: number }) {
  const [alerts, setAlerts] = useState([
    { id: 1, text: "PROJ-123 is currently blocked" },
    { id: 2, text: "Scope increased by 5 points" }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sprint Health Score</h3>
        <div className={`text-6xl font-black mt-2 ${score > 70 ? 'text-emerald-500' : 'text-rose-500'}`}>{score}</div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div className="bg-emerald-500 h-2" style={{ width: `${score}%` }}></div>
        </div>
      </div>
      <div className="bg-slate-900 p-6 rounded-2xl text-white">
        <h3 className="text-xs font-black mb-4 flex items-center gap-2 tracking-widest text-slate-400">
          <AlertCircle size={14} className="text-amber-400" /> ACTIVE BLOCKERS
        </h3>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-slate-800 p-3 rounded-xl flex justify-between items-center text-xs border-l-4 border-amber-500">
              <span>{alert.text}</span>
              <button onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}