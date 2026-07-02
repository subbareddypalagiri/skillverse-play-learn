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
import { Radio, ArrowLeft, Video, Link2, BookOpen, Lock, ShieldAlert } from 'lucide-react';

const CreateLiveRoom: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [isPrivate, setIsPrivate] = useState(false);
  const [passcode, setPasscode] = useState('');
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

    if (isPrivate && !passcode.trim()) {
      toast({
        title: "Passcode Required",
        description: "You must enter a passcode for a private room.",
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
        isPrivate,
        passcode: isPrivate ? passcode.trim() : undefined
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

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    Private Room
                  </Label>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Require a passcode for students to join</p>
                </div>
                <div 
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isPrivate ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${isPrivate ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>

              {isPrivate && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <Label htmlFor="passcode" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Room Passcode *
                  </Label>
                  <Input
                    id="passcode"
                    type="text"
                    placeholder="e.g. REACT2026"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    className="rounded-xl text-xs"
                    required={isPrivate}
                  />
                </div>
              )}
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
