
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const Layout = ({ className, children }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col w-full font-sans bg-white", className)}>
      <Navbar />
      <motion.main 
        className="flex-1 w-full mt-16" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children || <Outlet />}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
