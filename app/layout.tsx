"use client";
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Only show Sidebar if NOT on login page
  const showSidebar = pathname !== '/login';

  return (
    <html lang="en">
      <body className={showSidebar ? "flex" : "bg-gray-900"}>
        {showSidebar && <Sidebar />}
        <main className={showSidebar ? "flex-1 ml-64 p-8 min-h-screen" : "w-full h-screen"}>
          {children}
        </main>
      </body>
    </html>
  );
}