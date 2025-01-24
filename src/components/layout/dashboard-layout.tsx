import { useState } from "react";
import Sidebar from "../shared/sidebar";
import Header from "../shared/header";
import MobileSidebar from "../shared/mobile-sidebar";
import { MenuIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen bg-secondary">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <div className="flex w-0 flex-1 flex-col">
        <div className="relative z-10 flex h-20 flex-shrink-0 md:hidden">
          <button
            className="pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Header />
        </div>
        <main className="relative overflow-hidden mx-2 my-3 mr-2 flex-1 rounded-xl  bg-background focus:outline-none md:mx-0 md:my-4 md:mr-4 ">
          {children}
        </main>
      </div>
    </div>
  );
}
