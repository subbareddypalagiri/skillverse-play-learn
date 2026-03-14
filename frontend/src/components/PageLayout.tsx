import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const PageLayout = ({ children, className = "", fullWidth = false, noPadding = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={`flex-1 ${noPadding ? "" : "pt-24 pb-12 px-4"}`}>
        <div className={`${fullWidth ? "" : "container mx-auto max-w-7xl"} ${className}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
