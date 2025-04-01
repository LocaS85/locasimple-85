
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const Layout = ({ className, children }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col w-full font-sans bg-app-light", className)}>
      <Navbar />
      <main className="flex-1 w-full mt-16"> {/* Marge pour compenser la navbar fixe */}
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
