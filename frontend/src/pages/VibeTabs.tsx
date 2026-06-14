import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, ArrowLeft, Sparkles, Plus, Film, LayoutGrid, Trophy, BarChart3 } from 'lucide-react';
import ReelsTab from '@/components/vibe/ReelsTab';
import FeedTab from '@/components/vibe/FeedTab';
import ShowcaseTab from '@/components/vibe/ShowcaseTab';
import MyReelsTab from '@/components/vibe/MyReelsTab';
import { ReelUploadModal } from '@/components/vibe/ReelUploadModal';

type TabType = 'reels' | 'feed' | 'showcase' | 'my-reels';

const tabs: { id: TabType; label: string; icon: typeof Film; desc: string }[] = [
  { id: 'reels', label: 'Reels', icon: Film, desc: 'Short-form video' },
  { id: 'feed', label: 'Feed', icon: LayoutGrid, desc: 'Social posts' },
  { id: 'showcase', label: 'Showcase', icon: Trophy, desc: 'Your wins' },
  { id: 'my-reels', label: 'Analytics', icon: BarChart3, desc: 'Your stats' },
];

export default function VibeTabs() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#030014] text-white relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="absolute inset-0 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Zap className="w-5 h-5 text-black fill-black" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#030014] animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Vibe
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h1>
                  <p className="text-[11px] text-white/40 tracking-wide">Create · Share · Shine</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Post Video</span>
            </button>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 hover:border-white/20'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-[148px] pb-8 min-h-screen">
        {activeTab === 'reels' && <ReelsTab />}
        {activeTab === 'feed' && <FeedTab />}
        {activeTab === 'showcase' && <ShowcaseTab />}
        {activeTab === 'my-reels' && (
          <MyReelsTab onUploadClick={() => setUploadOpen(true)} />
        )}
      </div>

      {/* Floating upload on reels tab */}
      {activeTab === 'reels' && (
        <button
          onClick={() => setUploadOpen(true)}
          className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-2xl shadow-amber-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          title="Upload reel"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      )}

      <ReelUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
