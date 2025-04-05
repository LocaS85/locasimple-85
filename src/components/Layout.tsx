
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
