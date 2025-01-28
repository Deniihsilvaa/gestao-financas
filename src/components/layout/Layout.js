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
    <div className="grid grid-rows-[auto_1fr_auto] h-screen w-screen overflow-hidden">
      <div className="row z-10 max-w-100">
      {/* fixar o cabeçalho <div className="fixed top-0 left-0 right-0 z-10">*/}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div className="row md:p-1 lg:p-1 max-w-100">
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
         {/* <ScrollPanel style={{ width: '100vw', height: "calc(100vh - 64px)" }}> */}
        <ScrollPanel style={{ width: '100vw', height: '80vh' }}>
        <main
          className={`p-1 md:p-4 lg:p-4 flex-grow transition-all duration-500 ${
            isSidebarOpen ? "ml-10" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
        </ScrollPanel>
      </div>
      <div className="row bottom-0 left-0 right-0 z-10 max-w-100">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
