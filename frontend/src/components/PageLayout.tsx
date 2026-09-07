import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeatGradientBackground from "@/components/NeatGradientBackground";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const PageLayout = ({ children, className = "", fullWidth = false, noPadding = false }: PageLayoutProps) => {
  return (
    <div className="neat-gradient-layout min-h-screen w-full flex flex-col relative overflow-hidden bg-[#E4E4E4]">
      <NeatGradientBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className={`flex-1 ${noPadding ? "" : "pt-24 sm:pt-28 pb-12 px-4"}`}>
          <div className={`${fullWidth ? "" : "container mx-auto max-w-7xl"} ${className}`}>
            {children}
          </div>
        </main>
        <Footer neat />
      </div>
    </div>
  );
};

export default PageLayout;
