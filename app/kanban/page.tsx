"use client";
import { useSearchParams } from 'next/navigation';
import KanbanBoard from "@/components/KanbanBoard";

export default function KanbanPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {projectId ? 'Project Kanban Board' : 'Jira Real-time Sync'}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {projectId ? 'Viewing project tickets' : 'Live connection to your Jira board'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wide">Live Connection</span>
          </div>
        </div>
      </header>

      <KanbanBoard projectId={projectId} />
    </main>
  );
}
