import React from 'react';
import { AppSidebar } from '@/components/shell/AppSidebar';
import { TopBar } from '@/components/shell/TopBar';
import { MobileNav } from '@/components/shell/MobileNav';
import { MobileDrawer } from '@/components/shell/MobileDrawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F7F5F0]">
      {/* Sidebar for Desktop */}
      <AppSidebar />

      {/* Main Content Area with offset for Sidebar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Slide-out Navigation Drawer for Mobile */}
      <MobileDrawer />

      {/* Fixed Bottom Bar for Mobile */}
      <MobileNav />
    </div>
  );
}
