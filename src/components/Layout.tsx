
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col w-full", className)}>
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
