import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import "./layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen layout">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 p-3">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main
          className={`flex-grow transition-all duration-500 w-100 ${
            isSidebarOpen ? "ml-20" : "ml-0"
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
