import { useState } from "react";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">

      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;