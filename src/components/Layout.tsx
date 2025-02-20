
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
