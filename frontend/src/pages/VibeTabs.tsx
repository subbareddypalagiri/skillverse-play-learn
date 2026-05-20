import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';
import ReelsTab from '@/components/vibe/ReelsTab';
import FeedTab from '@/components/vibe/FeedTab';
import ShowcaseTab from '@/components/vibe/ShowcaseTab';
import MyReelsTab from '@/components/vibe/MyReelsTab';

type TabType = 'reels' | 'feed' | 'showcase' | 'my-reels';

export default function VibeTabs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('reels');

  const tabs = [
    { id: 'reels' as TabType, label: 'Reels', icon: '🎬' },
    { id: 'feed' as TabType, label: 'Feed', icon: '📱' },
    { id: 'showcase' as TabType, label: 'Showcase', icon: '🏆' },
    { id: 'my-reels' as TabType, label: 'My Reels', icon: '⭐' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title */}
          <div className="py-4 flex items-center gap-3 border-b border-gray-800">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <Zap className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl font-bold">Vibe</h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-32 pb-8">
        {activeTab === 'reels' && <ReelsTab />}
        {activeTab === 'feed' && <FeedTab />}
        {activeTab === 'showcase' && <ShowcaseTab />}
        {activeTab === 'my-reels' && <MyReelsTab />}
      </div>
    </div>
  );
}
