// app/page.tsx
import KanbanBoard from "@/components/KanbanBoard";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <header className="p-6 border-b border-zinc-800 flex justify-between items-center px-10">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter">Jira Real-time Sync</h1>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">FYP Module - Custom Board</p>
        </div>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Live Connection</span>
        </div>
      </header>
      <KanbanBoard />
    </main>
  );
}