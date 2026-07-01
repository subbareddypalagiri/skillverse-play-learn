import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CourseProvider } from "./contexts/CourseContext";
import { VideoProgressProvider } from "./contexts/VideoProgressContext";
import { SocialProvider } from "./contexts/SocialContext";
import { ClubProvider } from "./contexts/ClubContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// 👇 Patha Home badulu kotha NewLanding ni import chesthunnam
import Newlanding from "./pages/Newlanding"; 

import VibeTabs from "./pages/VibeTabs";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import EventDetailPage from "./pages/EventDetailPage";
import CareerHub from "./pages/CareerHub";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Sync from "./pages/Sync";
import ApplyMentor from "./pages/ApplyMentor";
import ApplyAlumniExpert from "./pages/ApplyAlumniExpert";
import ApplyAlumni from "./pages/ApplyAlumni";
import ClubPage from "./pages/ClubPage";
import AITools from "./pages/AITools";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import FloatingChatbot from "./components/FloatingChatbot";
import LiveRooms from "./pages/LiveRooms";
import CreateLiveRoom from "./pages/CreateLiveRoom";
import LiveStreamView from "./components/LiveStreamView";
import AdminConsole from "./pages/AdminConsole";

const queryClient = new QueryClient();

// Redirect already-logged-in users away from login/signup
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  // Only redirect if we're certain the user is logged in (not just loading)
  if (!loading && user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
        <CourseProvider>
          <VideoProgressProvider>
            <SocialProvider>
              <ClubProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                  {/* 👇 Ikkada Home element theesesi NewLanding pettam */}
                  <Route path="/" element={<Newlanding />} />
                  
                  <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                  <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminConsole /></ProtectedRoute>} />
                  <Route path="/live-rooms" element={<ProtectedRoute><LiveRooms /></ProtectedRoute>} />
                  <Route path="/live-rooms/create" element={<ProtectedRoute><CreateLiveRoom /></ProtectedRoute>} />
                  <Route path="/live-rooms/:id" element={<ProtectedRoute><LiveStreamView /></ProtectedRoute>} />
                  <Route path="/vibe" element={<ProtectedRoute><VibeTabs /></ProtectedRoute>} />
                  <Route path="/ai-tools" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
                  <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
                  <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                  <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
                  <Route path="/career" element={<ProtectedRoute><CareerHub /></ProtectedRoute>} />
                  <Route path="/sync" element={<ProtectedRoute><Sync /></ProtectedRoute>} />
                  <Route path="/apply-mentor" element={<ProtectedRoute><ApplyMentor /></ProtectedRoute>} />
                  <Route path="/apply-alumni-expert" element={<ProtectedRoute><ApplyAlumniExpert /></ProtectedRoute>} />
                  <Route path="/apply-alumni" element={<ProtectedRoute><ApplyAlumni /></ProtectedRoute>} />
                  <Route path="/clubs/:id" element={<ProtectedRoute><ClubPage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingChatbot />
              </BrowserRouter>
            </ClubProvider>
            </SocialProvider>
          </VideoProgressProvider>
        </CourseProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;