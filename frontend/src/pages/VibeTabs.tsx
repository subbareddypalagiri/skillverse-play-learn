import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Zap, Sparkles, Plus, Film, LayoutGrid, Trophy, BarChart3 } from 'lucide-react';
import ReelsTab from '@/components/vibe/ReelsTab';
import FeedTab from '@/components/vibe/FeedTab';
import ShowcaseTab from '@/components/vibe/ShowcaseTab';
import MyReelsTab from '@/components/vibe/MyReelsTab';
import { ReelUploadModal } from '@/components/vibe/ReelUploadModal';
import NeatGradientBackground from '@/components/NeatGradientBackground';
import Navbar from '@/components/Navbar';

type TabType = 'reels' | 'feed' | 'showcase' | 'my-reels';

const tabs: { id: TabType; label: string; icon: typeof Film; desc: string }[] = [
  { id: 'reels', label: 'Reels', icon: Film, desc: 'Short-form video' },
  { id: 'feed', label: 'Feed', icon: LayoutGrid, desc: 'Social posts' },
  { id: 'showcase', label: 'Showcase', icon: Trophy, desc: 'Your wins' },
  { id: 'my-reels', label: 'Analytics', icon: BarChart3, desc: 'Your stats' },
];

export default function VibeTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('reels');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [navRevealed, setNavRevealed] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType | null;
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setNavRevealed(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="neat-gradient-layout min-h-screen bg-[#E4E4E4] text-foreground relative overflow-x-hidden">
      <NeatGradientBackground />
      <Navbar />

      <div className="relative z-10">
        {/* Sticky vibe sub-header — stays below main navbar when scrolling */}
        <div className={`sticky z-40 transition-[top] duration-500 ease-out ${navRevealed ? 'top-16' : 'top-0'}`}>
          <div className="bg-[#f6f5fa]/90 backdrop-blur-xl border-b border-[#dddbe8] shadow-[0_1px_0_0_rgba(99,111,164,0.06)]">
            <div className="max-w-6xl mx-auto px-4">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#636FA4] to-[#9a8fb8] flex items-center justify-center shadow-lg shadow-[#636FA4]/30">
                      <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#f6f5fa] animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 text-[#3d4568]">
                      Vibe
                      <Sparkles className="w-4 h-4 text-[#636FA4]" />
                    </h1>
                    <p className="text-[11px] text-[#636FA4]/70 tracking-wide">Create · Share · Shine</p>
                  </div>
                </div>

                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#636FA4] to-[#7a85b0] hover:opacity-90 shadow-lg shadow-[#636FA4]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Post Video</span>
                </button>
              </div>

              {/* Tab pills */}
              <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                        isActive
                          ? 'bg-[#edeaf5] border-[#636FA4]/40 text-[#636FA4] shadow-sm shadow-[#636FA4]/10'
                          : 'bg-[#f6f5fa]/60 border-[#e8e6f0] text-[#636FA4]/60 hover:text-[#636FA4] hover:bg-[#edeaf5]/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#636FA4]' : ''}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pb-8 min-h-[calc(100vh-8rem)]">
          {activeTab === 'reels' && <ReelsTab />}
          {activeTab === 'feed' && <FeedTab />}
          {activeTab === 'showcase' && <ShowcaseTab />}
          {activeTab === 'my-reels' && (
            <MyReelsTab onUploadClick={() => setUploadOpen(true)} />
          )}
        </div>
      </div>

      {/* Floating upload on reels tab */}
      {activeTab === 'reels' && (
        <button
          onClick={() => setUploadOpen(true)}
          className="fixed bottom-8 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#636FA4] to-[#9a8fb8] text-white shadow-2xl shadow-[#636FA4]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          title="Upload reel"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      )}

      <ReelUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
