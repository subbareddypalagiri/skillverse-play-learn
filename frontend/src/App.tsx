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
import { ClerkProvider } from "@clerk/clerk-react";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

import { lazy, Suspense } from "react";

// Lazy-loaded page components for lightning-fast initial load & optimal chunking
const Newlanding = lazy(() => import("./pages/Newlanding"));
const VibeTabs = lazy(() => import("./pages/VibeTabs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Courses = lazy(() => import("./pages/Courses"));
const Events = lazy(() => import("./pages/Events"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const CareerHub = lazy(() => import("./pages/CareerHub"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sync = lazy(() => import("./pages/Sync"));
const ApplyMentor = lazy(() => import("./pages/ApplyMentor"));
const ApplyAlumniExpert = lazy(() => import("./pages/ApplyAlumniExpert"));
const ApplyAlumni = lazy(() => import("./pages/ApplyAlumni"));
const Clubs = lazy(() => import("./pages/Clubs"));
const ClubPage = lazy(() => import("./pages/ClubPage"));
const AITools = lazy(() => import("./pages/AITools"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Settings = lazy(() => import("./pages/Settings"));
const FloatingChatbot = lazy(() => import("./components/FloatingChatbot"));
const LiveRooms = lazy(() => import("./pages/LiveRooms"));
const CreateLiveRoom = lazy(() => import("./pages/CreateLiveRoom"));
const LiveStreamView = lazy(() => import("./components/LiveStreamView"));
const AdminConsole = lazy(() => import("./pages/AdminConsole"));

const PageLoadingFallback = () => (
  <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
    <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.18),rgba(0,0,0,0))]" />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 animate-spin p-[2px]">
          <div className="w-full h-full bg-zinc-950 rounded-[14px]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-violet-400 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">Loading experience...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

// Redirect already-logged-in users away from login/signup
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If signed in on Clerk but backend user sync is pending, show loading (prevents loop)
  if (isSignedIn && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
                    <Suspense fallback={<PageLoadingFallback />}>
                      <Routes>
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
                        <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
                        <Route path="/clubs/:id" element={<ProtectedRoute><ClubPage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <Suspense fallback={null}>
                      <FloatingChatbot />
                    </Suspense>
                  </BrowserRouter>
                </ClubProvider>
              </SocialProvider>
            </VideoProgressProvider>
          </CourseProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </ClerkProvider>
  </QueryClientProvider>
);

export default App;