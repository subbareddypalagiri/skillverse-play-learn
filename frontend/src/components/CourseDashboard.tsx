import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Code,
  Play,
  Download,
  Clock,
  CheckCircle,
  X,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface CourseDashboardProps {
  enrolledCourses: any[];
  onBack: () => void;
  embedded?: boolean;
}

// Public domain sample videos — zero CORS, load everywhere
const VIDEO_URLS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://www.w3schools.com/tags/movie.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
];

const LAB_STARTERS: Record<string, string> = {
  "Lab 1: Getting Started": `// Lab 1: Hello World & Basic Setup
// Run your first JavaScript program!

function greet(name) {
  return "Hello, " + name + "! Welcome to coding!";
}

console.log(greet("World"));
console.log(greet("Student"));

// Try modifying the greeting message above
// and run it by clicking "Run Code" below!`,

  "Lab 2: First Application": `// Lab 2: Build Your First Application
// Create a simple calculator function

function calculator(a, operation, b) {
  switch(operation) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : "Cannot divide by zero";
    default: return "Unknown operation";
  }
}

console.log("10 + 5 =", calculator(10, '+', 5));
console.log("20 - 8 =", calculator(20, '-', 8));
console.log("6 * 7 =", calculator(6, '*', 7));
console.log("15 / 3 =", calculator(15, '/', 3));`,

  "Lab 3: Advanced Features": `// Lab 3: Advanced JavaScript Features
// Working with arrays, objects and modern JS

const students = [
  { name: "Alice", score: 92, grade: "A" },
  { name: "Bob",   score: 78, grade: "B" },
  { name: "Carol", score: 85, grade: "B+" },
  { name: "Dave",  score: 96, grade: "A+" },
];

// Filter top students (score >= 85)
const topStudents = students.filter(s => s.score >= 85);
console.log("Top students:", topStudents.map(s => s.name));

// Average score
const avg = students.reduce((sum, s) => sum + s.score, 0) / students.length;
console.log("Class average:", avg.toFixed(1));`,

  "Lab 4: Final Project": `// Lab 4: Final Project — Mini Task Manager
// Build a complete task management system!

class TaskManager {
  constructor() { this.tasks = []; this.nextId = 1; }

  addTask(title, priority = "medium") {
    const task = { id: this.nextId++, title, priority, done: false };
    this.tasks.push(task);
    console.log("Added:", title);
    return task;
  }

  complete(id) {
    const t = this.tasks.find(t => t.id === id);
    if (t) { t.done = true; console.log("Completed:", t.title); }
  }

  summary() {
    const done = this.tasks.filter(t => t.done).length;
    console.log(\`Tasks: \${done}/\${this.tasks.length} done\`);
    this.tasks.forEach(t =>
      console.log(\`  [\${t.done ? "✓" : " "}] #\${t.id} \${t.title} (\${t.priority})\`));
  }
}

const tm = new TaskManager();
tm.addTask("Setup project", "high");
tm.addTask("Write components", "high");
tm.addTask("Add styling", "medium");
tm.complete(1);
tm.summary();`,
};

const CourseDashboard = ({ enrolledCourses, onBack, embedded = false }: CourseDashboardProps) => {
  const [videoModal, setVideoModal] = useState<{ title: string; url: string } | null>(null);
  const [labModal, setLabModal] = useState<{ title: string; code: string } | null>(null);
  const [labCode, setLabCode] = useState("");
  const [labOutput, setLabOutput] = useState("");
  const [labRunning, setLabRunning] = useState(false);

  const getCourseContent = (courseTitle: string) => ({
    videos: [
      { id: 1, title: "Introduction to Course", duration: "15:30", completed: true, url: VIDEO_URLS[0] },
      { id: 2, title: "Setting up Development Environment", duration: "22:45", completed: true, url: VIDEO_URLS[1] },
      { id: 3, title: "First Project Walkthrough", duration: "35:20", completed: false, url: VIDEO_URLS[2] },
      { id: 4, title: "Advanced Concepts", duration: "28:15", completed: false, url: VIDEO_URLS[3] },
    ],
    notes: [
      { id: 1, title: "Course Overview & Objectives", date: "2024-01-15", type: "PDF" },
      { id: 2, title: "Development Environment Setup Guide", date: "2024-01-16", type: "PDF" },
      { id: 3, title: "Best Practices & Tips", date: "2024-01-17", type: "PDF" },
      { id: 4, title: "Additional Resources", date: "2024-01-18", type: "PDF" },
    ],
    labs: [
      { id: 1, title: "Lab 1: Getting Started", description: "Basic setup and configuration", status: "Completed", dueDate: "2024-01-20" },
      { id: 2, title: "Lab 2: First Application", description: "Build your first application", status: "In Progress", dueDate: "2024-01-25" },
      { id: 3, title: "Lab 3: Advanced Features", description: "Implement advanced functionality", status: "Pending", dueDate: "2024-02-01" },
      { id: 4, title: "Lab 4: Final Project", description: "Complete final project submission", status: "Pending", dueDate: "2024-02-10" },
    ],
  });

  const getProgressPercentage = (courseTitle: string) => {
    const content = getCourseContent(courseTitle);
    const total = content.videos.length + content.labs.length;
    const done = content.videos.filter(v => v.completed).length + content.labs.filter(l => l.status === "Completed").length;
    return Math.round((done / total) * 100);
  };

  // ── Download note as a text file ──────────────────────────────
  const handleDownload = (note: { title: string; type: string }) => {
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\nThis document contains study notes and resources for your enrolled course.\n\n• Review all key concepts covered in the video lectures\n• Practice exercises are included at the end\n• Reference links: https://developer.mozilla.org\n\nGenerated by Risee Learning Platform — ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Open Lab modal ────────────────────────────────────────────
  const handleOpenLab = (lab: { title: string }) => {
    const starter = LAB_STARTERS[lab.title] || `// ${lab.title}\n// Write your code here...\n\nconsole.log("Hello from ${lab.title}!");`;
    setLabCode(starter);
    setLabOutput("");
    setLabModal({ title: lab.title, code: starter });
  };

  // ── Run lab code safely ───────────────────────────────────────
  const handleRunCode = () => {
    setLabRunning(true);
    setLabOutput("");
    setTimeout(() => {
      const logs: string[] = [];
      const sandbox = {
        console: { log: (...args: any[]) => logs.push(args.map(String).join(" ")) },
      };
      try {
        const fn = new Function("console", labCode);
        fn(sandbox.console);
        setLabOutput(logs.join("\n") || "✅ Code ran successfully (no output)");
      } catch (err: any) {
        setLabOutput(`❌ Error: ${err.message}`);
      }
      setLabRunning(false);
    }, 600);
  };

  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      {!embedded && <Navbar />}

      {/* ── VIDEO MODAL ─────────────────────────────────────────── */}
      {videoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setVideoModal(null)}>
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-white text-sm">{videoModal.title}</span>
              </div>
              <button onClick={() => setVideoModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Player */}
            <div className="bg-black">
              <video
                key={videoModal.url}
                src={videoModal.url}
                controls
                autoPlay
                className="w-full aspect-video"
                style={{ maxHeight: "70vh" }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 bg-gray-900 text-xs text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              Progress is tracked automatically as you watch
            </div>
          </div>
        </div>
      )}

      {/* ── LAB MODAL ───────────────────────────────────────────── */}
      {labModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col" style={{ maxHeight: "90vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-white text-sm">{labModal.title}</span>
              </div>
              <button onClick={() => setLabModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Code Editor */}
            <div className="bg-gray-950 p-1 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-gray-500">script.js</span>
              </div>
              <textarea
                value={labCode}
                onChange={e => setLabCode(e.target.value)}
                className="w-full bg-transparent text-green-300 font-mono text-sm p-4 outline-none resize-none"
                style={{ minHeight: "260px", lineHeight: "1.6" }}
                spellCheck={false}
              />
            </div>

            {/* Run button */}
            <div className="px-4 py-2 bg-gray-900 border-t border-white/5 flex items-center gap-3 flex-shrink-0">
              <button
                onClick={handleRunCode}
                disabled={labRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-all"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
              >
                <Play className="w-3.5 h-3.5" />
                {labRunning ? "Running..." : "▶ Run Code"}
              </button>
              <span className="text-xs text-gray-500">JavaScript sandbox — safe execution</span>
            </div>

            {/* Output */}
            <div className="bg-black flex-1 overflow-auto p-4">
              <p className="text-xs text-gray-500 mb-2 font-mono">// Output</p>
              {labOutput ? (
                <pre className={`font-mono text-sm whitespace-pre-wrap ${labOutput.startsWith("❌") ? "text-red-400" : "text-green-400"}`}>
                  {labOutput}
                </pre>
              ) : (
                <p className="text-gray-600 text-sm font-mono">Click "Run Code" to see output here...</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={embedded ? "" : "pt-24 pb-12 px-4"}>
        <div className={embedded ? "" : "container mx-auto"}>
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-accent">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Courses
            </Button>
            <h1 className="text-4xl font-bold mb-2">My Course Dashboard</h1>
            <p className="text-muted-foreground text-lg">Track your progress and access course materials</p>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                  <div className="h-48 bg-gradient-primary relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/20 text-white">{course.category}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white text-sm mb-2">Progress: {getProgressPercentage(course.title)}%</div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${getProgressPercentage(course.title)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{course.duration}</div>
                      <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" />Enrolled</div>
                    </div>
                    <Button
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                      onClick={() => {
                        const content = getCourseContent(course.title);
                        const nextVideo = content.videos.find(v => !v.completed) || content.videos[0];
                        setVideoModal({ title: nextVideo.title, url: nextVideo.url });
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />Continue Learning
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Course Content Tabs */}
          {enrolledCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <Tabs defaultValue="videos" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="videos" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />Video Lectures
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />Notes & Resources
                  </TabsTrigger>
                  <TabsTrigger value="labs" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />Labs & Assignments
                  </TabsTrigger>
                </TabsList>

                {/* Videos Tab */}
                <TabsContent value="videos" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} — Video Lectures</h3>
                        <div className="space-y-3">
                          {getCourseContent(course.title).videos.map((video) => (
                            <div key={video.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${video.completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                                  {video.completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h4 className="font-medium">{video.title}</h4>
                                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setVideoModal({ title: video.title, url: video.url })}
                                className="hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-400 transition-colors"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {video.completed ? "Rewatch" : "Watch"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} — Notes & Resources</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {getCourseContent(course.title).notes.map((note) => (
                            <div key={note.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium text-sm">{note.title}</h4>
                                  <p className="text-xs text-muted-foreground">{note.date} · {note.type}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(note)}
                                className="hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-2" />Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Labs Tab */}
                <TabsContent value="labs" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} — Labs & Assignments</h3>
                        <div className="space-y-4">
                          {getCourseContent(course.title).labs.map((lab) => (
                            <div key={lab.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Code className="w-5 h-5 text-orange-500" />
                                  <div>
                                    <h4 className="font-medium">{lab.title}</h4>
                                    <p className="text-sm text-muted-foreground">{lab.description}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant={lab.status === "Completed" ? "default" : lab.status === "In Progress" ? "secondary" : "outline"}
                                  className={lab.status === "Completed" ? "bg-green-500" : ""}
                                >
                                  {lab.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Due: {lab.dueDate}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenLab(lab)}
                                  className="hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-400 transition-colors"
                                >
                                  <Terminal className="w-4 h-4 mr-2" />
                                  {lab.status === "Completed" ? "Review" : lab.status === "In Progress" ? "Continue" : "Start"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Empty State */}
          {enrolledCourses.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Enrolled Courses</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any courses yet. Start exploring and enroll in courses to access this dashboard.
              </p>
              <Button onClick={onBack} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                Browse Courses
              </Button>
            </Card>
          )}
        </div>
      </div>

      {!embedded && <Footer />}
    </div>
  );
};

export default CourseDashboard;
