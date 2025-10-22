import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, GraduationCap, Users, Video, MessageCircle, Handshake, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const domains = [
  { id: "ai", name: "AI & Machine Learning" },
  { id: "web", name: "Web Development" },
  { id: "mobile", name: "Mobile Development" },
  { id: "cloud", name: "Cloud & DevOps" },
  { id: "data", name: "Data Science" },
  { id: "design", name: "UI/UX Design" },
];

const alumniTalks = [
  {
    id: "t1",
    domain: "ai",
    name: "Priya Nair",
    role: "Senior ML Engineer @ OpenAI",
    time: "Fri, 5:00 PM",
    topic: "Practical LLM Finetuning in Production",
    avatar: "https://i.pravatar.cc/150?img=47",
    attendees: 128,
  },
  {
    id: "t2",
    domain: "web",
    name: "Aman Verma",
    role: "Staff Frontend @ Stripe",
    time: "Sat, 11:00 AM",
    topic: "Design Systems that Scale",
    avatar: "https://i.pravatar.cc/150?img=12",
    attendees: 203,
  },
  {
    id: "t3",
    domain: "cloud",
    name: "Zara Sheikh",
    role: "SRE Lead @ Google",
    time: "Sun, 9:30 AM",
    topic: "Resilience Engineering 101",
    avatar: "https://i.pravatar.cc/150?img=5",
    attendees: 95,
  },
];

const mentors = [
  { id: "m1", domain: "ai", name: "Rohan Das", role: "ML Mentor", rating: 4.9, sessions: 320, avatar: "https://i.pravatar.cc/150?img=33" },
  { id: "m2", domain: "web", name: "Sara Lee", role: "Frontend Mentor", rating: 4.8, sessions: 270, avatar: "https://i.pravatar.cc/150?img=21" },
  { id: "m3", domain: "data", name: "Kabir Singh", role: "Data Mentor", rating: 4.7, sessions: 190, avatar: "https://i.pravatar.cc/150?img=14" },
  { id: "m4", domain: "cloud", name: "Ananya Rao", role: "DevOps Mentor", rating: 5.0, sessions: 410, avatar: "https://i.pravatar.cc/150?img=55" },
];

const Sync = () => {
  const [domain, setDomain] = useState<string>("ai");

  const filteredTalks = useMemo(() => alumniTalks.filter(t => t.domain === domain), [domain]);
  const filteredMentors = useMemo(() => mentors.filter(m => m.domain === domain), [domain]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground shadow-card">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide">SYNC</span>
              </div>
              <h1 className="text-4xl font-bold mt-3 mb-2">Talk to the Right People</h1>
              <p className="text-muted-foreground text-lg">Join alumni expert talks and book 1:1 sessions with mentors in your domain.</p>
            </div>

            <div className="w-full md:w-80">
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Domains</SelectLabel>
                    {domains.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="talks" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-[420px]">
              <TabsTrigger value="talks" className="text-base">
                <GraduationCap className="w-4 h-4 mr-2" /> Alumni Expert Talks
              </TabsTrigger>
              <TabsTrigger value="mentors" className="text-base">
                <Handshake className="w-4 h-4 mr-2" /> Mentor Connect
              </TabsTrigger>
            </TabsList>

            <TabsContent value="talks" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTalks.map(t => (
                  <Card key={t.id} className="overflow-hidden border-0 bg-gradient-to-br from-card to-card/60 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                    <div className="h-1 w-full bg-gradient-to-r from-primary/70 to-primary" />
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                          <AvatarImage src={t.avatar} />
                          <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-sm text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-5">
                        <div className="text-base font-medium">{t.topic}</div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="inline-flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary/70" />{t.time}</div>
                          <div className="inline-flex items-center"><Users className="w-4 h-4 mr-2 text-primary/70" />{t.attendees} registered</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90">
                          <Video className="w-4 h-4 mr-2" /> Join Live
                        </Button>
                        <Button variant="secondary" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-2" /> Ask a Question
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map(m => (
                  <Card key={m.id} className="p-6 border-0 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                        <AvatarImage src={m.avatar} />
                        <AvatarFallback>MN</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-sm text-muted-foreground">{m.role}</div>
                        <div className="text-xs text-muted-foreground">{m.sessions} sessions • {m.rating}★</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">Mock Interview</Badge>
                      <Badge variant="secondary">Resume Review</Badge>
                      <Badge variant="outline">Roadmap</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90">
                        <Clock className="w-4 h-4 mr-2" /> Book 1:1
                      </Button>
                      <Button variant="secondary" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sync;



