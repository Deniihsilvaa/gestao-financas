import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { ScrollPanel } from 'primereact/scrollpanel';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="grid grid-rows-layout h-screen w-screen overflow-hidden">
      <div className="row top-0 left-0 right-0 z-10">
      {/* fixar o cabeçalho <div className="fixed top-0 left-0 right-0 z-10">*/}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="row md:p-1 lg:p-1">
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
        <ScrollPanel style={{ width: '100vw', height: '80vh' }}>
        <main
          className={`p-2 md:p-4 lg:p-4 flex-grow  transition-all duration-500 w-100 h-100 ${
            isSidebarOpen ? "ml-10" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
        </ScrollPanel>
      </div>
      <div className="row fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
