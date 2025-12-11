import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CourseProvider } from "./contexts/CourseContext";
import { VideoProgressProvider } from "./contexts/VideoProgressContext";
import { SocialProvider } from "./contexts/SocialContext";
import { ClubProvider } from "./contexts/ClubContext";
import Home from "./pages/Home";
import Vibe from "./pages/Vibe";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import CareerHub from "./pages/CareerHub";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Sync from "./pages/Sync";
import AITools from "./pages/AITools";
import AIAssistant from "./pages/AIAssistant";
import FloatingChatbot from "./components/FloatingChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CourseProvider>
        <VideoProgressProvider>
          <SocialProvider>
            <ClubProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/vibe" element={<Vibe />} />
                  <Route path="/ai-tools" element={<AITools />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/career" element={<CareerHub />} />
                  <Route path="/sync" element={<Sync />} />
                  {/* Hobbies & Clubs are now within Events page */}
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingChatbot />
              </BrowserRouter>
            </ClubProvider>
          </SocialProvider>
        </VideoProgressProvider>
      </CourseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
