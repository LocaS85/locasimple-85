
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col w-full", className)}>
      <Navbar />
      <main className="flex-1 w-full mt-16"> {/* Marge pour compenser la navbar fixe */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
