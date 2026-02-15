"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Kanban, FileText, LogOut, Layers } from 'lucide-react'; // Added 'Layers' icon

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Kill the cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push('/login');
  };

  const navItems = [
    { name: 'Projects', href: '/projects', icon: Layers }, // <-- Added this at the top
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Board', href: '/kanban', icon: Kanban },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  // Hide sidebar on login page
  if (pathname === '/login') return null;

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col p-4 border-r border-slate-800 z-50">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10 text-blue-400 pl-2">Agile AI</h1>
      
      {/* Nav Links */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          // Highlight if path starts with the href (so /projects works for sub-pages too)
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Absolute Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-3 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-colors border border-red-900/30"
        >
          <LogOut size={20} />
          <span className="font-semibold">Log Out</span>
        </button>
      </div>

    </div>
  );
}