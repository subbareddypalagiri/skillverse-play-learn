import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import apiClient from '@/lib/apiClient';
import { Radio, ArrowLeft, Video, Link2, BookOpen } from 'lucide-react';

const CreateLiveRoom: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [streamUrl, setStreamUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Web Development",
    "Cloud & DevOps",
    "AI & ML",
    "Data Science",
    "Cybersecurity",
    "Programming"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title and Stream Agenda).",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.post('/live/rooms', {
        title,
        topic,
        category,
        streamUrl: streamUrl.trim() || undefined
      });

      toast({
        title: "Live Stream Created",
        description: "Your live broadcast has started!"
      });
      
      const newRoomId = res.data.data.room._id;
      navigate(`/live-rooms/${newRoomId}`);
    } catch (err: any) {
      toast({
        title: "Broadcasting Failed",
        description: err.response?.data?.message || "Failed to initialize live session.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <Button onClick={() => navigate('/live-rooms')} variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Live Hub
        </Button>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          <Video className="w-6 h-6 text-red-500 animate-pulse" />
          Setup Live Stream
        </h1>
        <p className="text-muted-foreground text-sm">
          Set up your broadcast details to configure your virtual classroom.
        </p>
      </div>

      <div className="max-w-xl">
        <Card className="p-6 border-border/50 bg-card rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-foreground">Stream Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Masterclass in Docker Containers & CI/CD Pipelines"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold text-foreground">Domain / Subject Category *</Label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-xs font-semibold text-foreground">Stream Agenda & Description *</Label>
              <textarea
                id="topic"
                placeholder="Detail the subjects you will write code on or explain during this live session..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full min-h-[90px] p-3 rounded-xl border border-input bg-background text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl font-semibold mt-4 text-xs text-white"
              style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}
            >
              {submitting ? "Starting stream..." : "Start Broadcast Now"}
            </Button>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CreateLiveRoom;
