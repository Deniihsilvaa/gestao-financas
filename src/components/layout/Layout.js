import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen layout">
      {/* fixar o cabeçalho */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-1 m-5">
        {/* Barra Lateral */}
        <aside
          className={`transition-all duration-500 z-1 ${
            isSidebarOpen ? "w-64" : "w-16"
          } flex-shrink-0 fixed top-0 bottom-0 left-0 z-20 pt-16`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
        <main
          className={`flex-grow transition-all duration-500 w-100 ${
            isSidebarOpen ? "ml-10" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
