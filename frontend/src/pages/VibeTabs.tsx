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

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType | null;
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),rgba(0,0,0,0))]" />
      <Navbar />

      <div className="relative z-10 pt-16">
        {/* Sticky vibe sub-header — securely anchored below navbar without jumping */}
        <div className="sticky top-16 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 shadow-xl shadow-black/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 text-white">
                    Vibe
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </h1>
                  <p className="text-[11px] text-zinc-400 tracking-wide">Create · Share · Shine</p>
                </div>
              </div>

              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Post Video</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? 'bg-violet-600/20 border-violet-500/50 text-violet-200 shadow-sm shadow-violet-500/20'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[calc(100vh-8rem)]">
          {activeTab === 'reels' && <ReelsTab />}
          {activeTab === 'feed' && <FeedTab />}
          {activeTab === 'showcase' && <ShowcaseTab />}
          {activeTab === 'my-reels' && (
            <MyReelsTab onUploadClick={() => setUploadOpen(true)} />
          )}
        </div>
      </div>

      <ReelUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
