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
import VideoPlayerWithTracking from "@/components/VideoPlayerWithTracking";
import { useVideoProgress } from "@/contexts/VideoProgressContext";

interface CourseDashboardProps {
  enrolledCourses: any[];
  onBack: () => void;
  embedded?: boolean;
}

// ── Course-specific lab definitions ─────────────────────────────
const COURSE_LABS: Record<string, { labs: { id: number; title: string; description: string; status: string; dueDate: string }[]; starters: Record<string, string> }> = {
  "Web Development": {
    labs: [
      { id: 1, title: "Build a Responsive Navbar", description: "Create a mobile-friendly navigation bar with HTML, CSS & JS", status: "Pending", dueDate: "2025-02-01" },
      { id: 2, title: "REST API with Express", description: "Build a CRUD API using Node.js and Express", status: "Pending", dueDate: "2025-02-15" },
      { id: 3, title: "React State Management", description: "Implement state with useState, useEffect and Context API", status: "Pending", dueDate: "2025-03-01" },
      { id: 4, title: "Full Stack Todo App", description: "Build a complete MERN stack Todo application", status: "Pending", dueDate: "2025-03-15" },
    ],
    starters: {
      "Build a Responsive Navbar": `// Lab: Build a Responsive Navbar
// Simulating DOM manipulation logic

class Navbar {
  constructor(brand, links) {
    this.brand = brand;
    this.links = links;
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    console.log("Menu", this.isOpen ? "OPENED ☰" : "CLOSED ✕");
  }

  render() {
    console.log("━".repeat(40));
    console.log("🔷 " + this.brand);
    console.log("━".repeat(40));
    this.links.forEach(link =>
      console.log("  → " + link));
    console.log("━".repeat(40));
  }
}

const nav = new Navbar("Risee", ["Home", "Courses", "Career Hub", "Profile"]);
nav.render();
nav.toggle();`,

      "REST API with Express": `// Lab: REST API Design
// Simulating Express route handlers

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

function handleGET(path) {
  if (path === "/users") {
    console.log("GET /users → 200 OK");
    console.log(JSON.stringify(users, null, 2));
  }
}

function handlePOST(path, body) {
  const newUser = { id: users.length + 1, ...body };
  users.push(newUser);
  console.log("POST /users → 201 Created");
  console.log("New user:", JSON.stringify(newUser));
}

function handleDELETE(path, id) {
  const idx = users.findIndex(u => u.id === id);
  if (idx >= 0) {
    users.splice(idx, 1);
    console.log("DELETE /users/" + id + " → 200 OK");
  }
}

handleGET("/users");
handlePOST("/users", { name: "Charlie", email: "charlie@test.com" });
handleDELETE("/users", 1);
handleGET("/users");`,

      "React State Management": `// Lab: React State Simulation
// Understanding state management patterns

class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  setState(updater) {
    const prev = { ...this.state };
    this.state = typeof updater === "function"
      ? updater(prev) : { ...prev, ...updater };
    console.log("State updated:", JSON.stringify(this.state));
    this.listeners.forEach(fn => fn(this.state));
  }

  subscribe(fn) { this.listeners.push(fn); }
}

const store = new StateManager({ count: 0, theme: "dark" });

store.subscribe(state =>
  console.log("  → UI re-rendered with count:", state.count));

console.log("Initial:", JSON.stringify(store.state));
store.setState(prev => ({ count: prev.count + 1 }));
store.setState(prev => ({ count: prev.count + 1 }));
store.setState({ theme: "light" });
console.log("Final:", JSON.stringify(store.state));`,

      "Full Stack Todo App": `// Lab: Full Stack Todo App Logic

class TodoApp {
  constructor() { this.todos = []; this.nextId = 1; }

  add(text) {
    this.todos.push({ id: this.nextId++, text, done: false, createdAt: new Date().toISOString() });
    console.log("✅ Added: " + text);
  }

  toggle(id) {
    const t = this.todos.find(t => t.id === id);
    if (t) { t.done = !t.done; console.log((t.done ? "☑️" : "⬜") + " " + t.text); }
  }

  remove(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    console.log("🗑️ Removed todo #" + id);
  }

  list() {
    console.log("\\n📋 My Todos (" + this.todos.filter(t=>t.done).length + "/" + this.todos.length + " done)");
    this.todos.forEach(t =>
      console.log("  " + (t.done ? "☑️" : "⬜") + " " + t.text));
  }
}

const app = new TodoApp();
app.add("Learn React hooks");
app.add("Build REST API");
app.add("Connect frontend to backend");
app.add("Deploy to Vercel");
app.toggle(1);
app.toggle(2);
app.remove(3);
app.list();`,
    },
  },

  "Cloud & DevOps": {
    labs: [
      { id: 1, title: "Cloud Service Simulator", description: "Simulate AWS S3, EC2 and Lambda services", status: "Pending", dueDate: "2025-02-01" },
      { id: 2, title: "Docker Container Manager", description: "Simulate Docker container lifecycle management", status: "Pending", dueDate: "2025-02-15" },
      { id: 3, title: "CI/CD Pipeline Builder", description: "Design an automated deployment pipeline", status: "Pending", dueDate: "2025-03-01" },
      { id: 4, title: "Kubernetes Orchestrator", description: "Simulate pod management and scaling", status: "Pending", dueDate: "2025-03-15" },
    ],
    starters: {
      "Cloud Service Simulator": `// Lab: AWS Cloud Service Simulator

class S3Bucket {
  constructor(name) { this.name = name; this.objects = []; }
  put(key, size) { this.objects.push({key, size}); console.log("📦 S3: Uploaded " + key + " (" + size + "KB)"); }
  list() { console.log("📂 Bucket: " + this.name); this.objects.forEach(o => console.log("  └─ " + o.key + " (" + o.size + "KB)")); }
}

class EC2Instance {
  constructor(type, region) { this.type = type; this.region = region; this.status = "stopped"; }
  start() { this.status = "running"; console.log("🖥️ EC2 " + this.type + " → RUNNING in " + this.region); }
  stop() { this.status = "stopped"; console.log("🖥️ EC2 " + this.type + " → STOPPED"); }
}

class Lambda {
  constructor(name) { this.name = name; this.invocations = 0; }
  invoke(event) { this.invocations++; console.log("⚡ Lambda " + this.name + " invoked (#" + this.invocations + ") with:", JSON.stringify(event)); }
}

const bucket = new S3Bucket("my-app-bucket");
bucket.put("index.html", 12);
bucket.put("styles.css", 8);
bucket.put("app.js", 45);
bucket.list();

const server = new EC2Instance("t2.micro", "ap-south-1");
server.start();

const fn = new Lambda("processUpload");
fn.invoke({ file: "photo.jpg" });
fn.invoke({ file: "document.pdf" });`,

      "Docker Container Manager": `// Lab: Docker Container Manager

class DockerEngine {
  constructor() { this.containers = []; this.images = ["node:18", "nginx:latest", "mongo:7", "redis:alpine"]; }

  pull(image) { console.log("📥 Pulling " + image + "..."); this.images.push(image); }

  run(name, image, port) {
    const container = { name, image, port, status: "running", id: Math.random().toString(36).slice(2,8) };
    this.containers.push(container);
    console.log("🐳 Container " + name + " started (port " + port + ")");
    return container;
  }

  stop(name) {
    const c = this.containers.find(c => c.name === name);
    if (c) { c.status = "stopped"; console.log("⏹️ Stopped: " + name); }
  }

  ps() {
    console.log("\\n🐳 DOCKER PS");
    console.log("ID\\t\\tNAME\\t\\tIMAGE\\t\\tSTATUS");
    this.containers.forEach(c =>
      console.log(c.id + "\\t" + c.name + "\\t" + c.image + "\\t" + c.status));
  }
}

const docker = new DockerEngine();
docker.run("web", "nginx:latest", 80);
docker.run("api", "node:18", 3000);
docker.run("db", "mongo:7", 27017);
docker.ps();
docker.stop("db");
docker.ps();`,

      "CI/CD Pipeline Builder": `// Lab: CI/CD Pipeline Simulation

class Pipeline {
  constructor(name) { this.name = name; this.stages = []; }

  addStage(name, fn) { this.stages.push({ name, fn }); return this; }

  async run() {
    console.log("🚀 Pipeline: " + this.name);
    console.log("═".repeat(40));
    for (const stage of this.stages) {
      console.log("▶ Stage: " + stage.name);
      const result = stage.fn();
      console.log("  ✅ " + result);
    }
    console.log("═".repeat(40));
    console.log("🎉 Pipeline completed successfully!");
  }
}

const pipeline = new Pipeline("Deploy to Production");
pipeline
  .addStage("Lint", () => "Code quality check passed")
  .addStage("Test", () => "47 tests passed, 0 failed")
  .addStage("Build", () => "Bundle created (2.3MB)")
  .addStage("Docker", () => "Image built: app:v1.2.3")
  .addStage("Deploy", () => "Deployed to production cluster")
  .run();`,

      "Kubernetes Orchestrator": `// Lab: Kubernetes Pod Simulator

class K8sCluster {
  constructor() { this.pods = []; this.services = []; }

  createPod(name, image, replicas) {
    for (let i = 0; i < replicas; i++) {
      this.pods.push({ name: name + "-" + i, image, status: "Running", restarts: 0 });
    }
    console.log("🟢 Created " + replicas + " pod(s): " + name);
  }

  scale(name, count) {
    const existing = this.pods.filter(p => p.name.startsWith(name)).length;
    console.log("📈 Scaling " + name + ": " + existing + " → " + count + " replicas");
    if (count > existing) this.createPod(name, "app:latest", count - existing);
  }

  expose(name, port) {
    this.services.push({ name: name + "-svc", targetPort: port, type: "ClusterIP" });
    console.log("🌐 Service created: " + name + "-svc → port " + port);
  }

  status() {
    console.log("\\n☸️  CLUSTER STATUS");
    console.log("Pods: " + this.pods.length);
    this.pods.forEach(p => console.log("  " + p.name + "\\t" + p.status));
    console.log("Services: " + this.services.length);
    this.services.forEach(s => console.log("  " + s.name + "\\tport:" + s.targetPort));
  }
}

const cluster = new K8sCluster();
cluster.createPod("frontend", "nginx:latest", 2);
cluster.createPod("api", "node:18", 3);
cluster.createPod("db", "mongo:7", 1);
cluster.expose("frontend", 80);
cluster.expose("api", 3000);
cluster.scale("api", 5);
cluster.status();`,
    },
  },

  "AI & ML": {
    labs: [
      { id: 1, title: "Data Preprocessing", description: "Clean and prepare datasets for ML models", status: "Pending", dueDate: "2025-02-01" },
      { id: 2, title: "Linear Regression", description: "Implement a linear regression model from scratch", status: "Pending", dueDate: "2025-02-15" },
      { id: 3, title: "Neural Network Simulator", description: "Build a simple neural network with forward propagation", status: "Pending", dueDate: "2025-03-01" },
      { id: 4, title: "Model Evaluation", description: "Calculate accuracy, precision, recall and F1 score", status: "Pending", dueDate: "2025-03-15" },
    ],
    starters: {
      "Data Preprocessing": `// Lab: Data Preprocessing for ML

const rawData = [
  { age: 25, salary: 50000, city: "Mumbai", purchased: "Yes" },
  { age: null, salary: 62000, city: "Delhi", purchased: "No" },
  { age: 30, salary: null, city: "Bangalore", purchased: "Yes" },
  { age: 35, salary: 58000, city: "Mumbai", purchased: "Yes" },
  { age: 28, salary: 72000, city: null, purchased: "No" },
];

console.log("📊 Raw Data: " + rawData.length + " records");

// Handle missing values
const avgAge = rawData.filter(r=>r.age).reduce((s,r)=>s+r.age,0) / rawData.filter(r=>r.age).length;
const avgSalary = rawData.filter(r=>r.salary).reduce((s,r)=>s+r.salary,0) / rawData.filter(r=>r.salary).length;

const cleaned = rawData.map(r => ({
  age: r.age || Math.round(avgAge),
  salary: r.salary || Math.round(avgSalary),
  city: r.city || "Unknown",
  purchased: r.purchased === "Yes" ? 1 : 0
}));

console.log("\\n✅ Cleaned Data:");
cleaned.forEach(r => console.log("  Age:" + r.age + " Salary:" + r.salary + " City:" + r.city + " Buy:" + r.purchased));

// Normalize
const maxAge = Math.max(...cleaned.map(r=>r.age));
const maxSal = Math.max(...cleaned.map(r=>r.salary));
console.log("\\n📈 Normalized age & salary to [0,1] range");
cleaned.forEach(r => console.log("  " + (r.age/maxAge).toFixed(2) + " | " + (r.salary/maxSal).toFixed(2)));`,

      "Linear Regression": `// Lab: Linear Regression from Scratch

// Training data: hours studied → exam score
const data = [
  [1, 45], [2, 55], [3, 60], [4, 68], [5, 72],
  [6, 78], [7, 82], [8, 88], [9, 92], [10, 95]
];

let w = 0, b = 0; // weight and bias
const lr = 0.01;   // learning rate
const epochs = 100;

console.log("🧠 Training Linear Regression...");

for (let e = 0; e < epochs; e++) {
  let dw = 0, db = 0;
  for (const [x, y] of data) {
    const pred = w * x + b;
    dw += -2 * x * (y - pred);
    db += -2 * (y - pred);
  }
  w -= lr * dw / data.length;
  b -= lr * db / data.length;

  if (e % 25 === 0) {
    const mse = data.reduce((s,[x,y]) => s + (y-(w*x+b))**2, 0) / data.length;
    console.log("Epoch " + e + " | MSE: " + mse.toFixed(2) + " | w=" + w.toFixed(3) + " b=" + b.toFixed(3));
  }
}

console.log("\\n✅ Model: score = " + w.toFixed(2) + " × hours + " + b.toFixed(2));
console.log("\\n📊 Predictions:");
[3, 6, 11, 15].forEach(h =>
  console.log("  " + h + " hours → " + Math.round(w*h+b) + " marks"));`,

      "Neural Network Simulator": `// Lab: Simple Neural Network (Forward Pass)

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function relu(x) { return Math.max(0, x); }

class NeuralNetwork {
  constructor(layers) {
    this.weights = [];
    this.biases = [];
    for (let i = 1; i < layers.length; i++) {
      this.weights.push(Array.from({length: layers[i]}, () =>
        Array.from({length: layers[i-1]}, () => (Math.random()-0.5)*2)));
      this.biases.push(Array.from({length: layers[i]}, () => Math.random()-0.5));
    }
  }

  forward(input) {
    let current = input;
    for (let l = 0; l < this.weights.length; l++) {
      const next = [];
      for (let n = 0; n < this.weights[l].length; n++) {
        let sum = this.biases[l][n];
        for (let w = 0; w < current.length; w++) sum += current[w] * this.weights[l][n][w];
        next.push(l < this.weights.length-1 ? relu(sum) : sigmoid(sum));
      }
      current = next;
    }
    return current;
  }
}

const nn = new NeuralNetwork([2, 4, 3, 1]); // 2 inputs → 4 → 3 → 1 output
console.log("🧠 Neural Network: 2 → 4 → 3 → 1");

const testCases = [[0,0],[0,1],[1,0],[1,1]];
testCases.forEach(input => {
  const output = nn.forward(input);
  console.log("Input: [" + input + "] → Output: " + output[0].toFixed(4));
});`,

      "Model Evaluation": `// Lab: ML Model Evaluation Metrics

// Confusion matrix values
const predictions = [1,1,0,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,1,0];
const actual =      [1,0,0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0];

let TP=0, TN=0, FP=0, FN=0;
for (let i = 0; i < predictions.length; i++) {
  if (predictions[i]===1 && actual[i]===1) TP++;
  if (predictions[i]===0 && actual[i]===0) TN++;
  if (predictions[i]===1 && actual[i]===0) FP++;
  if (predictions[i]===0 && actual[i]===1) FN++;
}

const accuracy = (TP+TN) / (TP+TN+FP+FN);
const precision = TP / (TP+FP);
const recall = TP / (TP+FN);
const f1 = 2 * (precision*recall) / (precision+recall);

console.log("📊 Confusion Matrix:");
console.log("         Predicted");
console.log("         +    -");
console.log("Actual + " + TP + "    " + FN);
console.log("       - " + FP + "    " + TN);
console.log("\\n📈 Metrics:");
console.log("Accuracy:  " + (accuracy*100).toFixed(1) + "%");
console.log("Precision: " + (precision*100).toFixed(1) + "%");
console.log("Recall:    " + (recall*100).toFixed(1) + "%");
console.log("F1 Score:  " + (f1*100).toFixed(1) + "%");`,
    },
  },

  "Data Science": {
    labs: [
      { id: 1, title: "Data Analysis Pipeline", description: "Analyze and visualize datasets with statistics", status: "Pending", dueDate: "2025-02-01" },
      { id: 2, title: "Statistical Computing", description: "Implement statistical tests and distributions", status: "Pending", dueDate: "2025-02-15" },
      { id: 3, title: "Data Transformation", description: "ETL operations: Extract, Transform, Load", status: "Pending", dueDate: "2025-03-01" },
      { id: 4, title: "Dashboard Metrics", description: "Build KPI calculations for a business dashboard", status: "Pending", dueDate: "2025-03-15" },
    ],
    starters: {
      "Data Analysis Pipeline": `// Lab: Data Analysis Pipeline

const salesData = [
  { month: "Jan", revenue: 45000, orders: 120 },
  { month: "Feb", revenue: 52000, orders: 145 },
  { month: "Mar", revenue: 49000, orders: 132 },
  { month: "Apr", revenue: 61000, orders: 178 },
  { month: "May", revenue: 58000, orders: 165 },
  { month: "Jun", revenue: 72000, orders: 210 },
];

console.log("📊 Sales Analysis");
const totalRev = salesData.reduce((s,d) => s+d.revenue, 0);
const avgRev = totalRev / salesData.length;
const maxMonth = salesData.reduce((a,b) => a.revenue > b.revenue ? a : b);

console.log("Total Revenue: ₹" + totalRev.toLocaleString());
console.log("Avg Monthly: ₹" + Math.round(avgRev).toLocaleString());
console.log("Best Month: " + maxMonth.month + " (₹" + maxMonth.revenue.toLocaleString() + ")");
console.log("\\nMonth-over-Month Growth:");
for (let i = 1; i < salesData.length; i++) {
  const growth = ((salesData[i].revenue - salesData[i-1].revenue) / salesData[i-1].revenue * 100);
  console.log("  " + salesData[i].month + ": " + (growth>0?"+":"") + growth.toFixed(1) + "%");
}`,
      "Statistical Computing": `// Lab: Statistical Computing
const data = [23,45,67,12,89,34,56,78,90,11,43,65,87,32,54];
const n = data.length;
const mean = data.reduce((s,v)=>s+v,0)/n;
const sorted = [...data].sort((a,b)=>a-b);
const median = n%2 ? sorted[Math.floor(n/2)] : (sorted[n/2-1]+sorted[n/2])/2;
const variance = data.reduce((s,v)=>s+(v-mean)**2,0)/n;
const stdDev = Math.sqrt(variance);
console.log("📊 Dataset:", data.join(", "));
console.log("Mean: " + mean.toFixed(2));
console.log("Median: " + median);
console.log("Std Dev: " + stdDev.toFixed(2));
console.log("Min: " + sorted[0] + " | Max: " + sorted[n-1]);
console.log("Range: " + (sorted[n-1]-sorted[0]));`,
      "Data Transformation": `// Lab: ETL Pipeline
const raw = ["ALICE,28,MUM","BOB,35,DEL","charlie,22,BLR","DAVE,,CHN"];
console.log("📥 Extract:", raw);
const transformed = raw.map(r => {
  const [name,age,city] = r.split(",");
  return { name: name.charAt(0).toUpperCase()+name.slice(1).toLowerCase(), age: parseInt(age)||25, city };
});
console.log("🔄 Transform:");
transformed.forEach(r => console.log("  " + JSON.stringify(r)));
console.log("📤 Load: " + transformed.length + " records ready for database");`,
      "Dashboard Metrics": `// Lab: KPI Dashboard
const metrics = { users: 15420, revenue: 892000, orders: 3240, returns: 89 };
console.log("📊 Dashboard KPIs");
console.log("Users: " + metrics.users.toLocaleString());
console.log("Revenue: ₹" + metrics.revenue.toLocaleString());
console.log("AOV: ₹" + Math.round(metrics.revenue/metrics.orders));
console.log("Return Rate: " + (metrics.returns/metrics.orders*100).toFixed(1) + "%");`,
    },
  },
};

// Fallback generic labs
const DEFAULT_LABS = {
  labs: [
    { id: 1, title: "Getting Started", description: "Introduction and setup", status: "Pending", dueDate: "2025-02-01" },
    { id: 2, title: "Core Concepts", description: "Practice fundamental concepts", status: "Pending", dueDate: "2025-02-15" },
    { id: 3, title: "Hands-on Project", description: "Build a mini project", status: "Pending", dueDate: "2025-03-01" },
    { id: 4, title: "Final Challenge", description: "Complete the capstone challenge", status: "Pending", dueDate: "2025-03-15" },
  ],
  starters: {} as Record<string, string>,
};

const CourseDashboard = ({ enrolledCourses, onBack, embedded = false }: CourseDashboardProps) => {
  const [labModal, setLabModal] = useState<{ title: string; code: string } | null>(null);
  const [labCode, setLabCode] = useState("");
  const [labOutput, setLabOutput] = useState("");
  const [labRunning, setLabRunning] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");

  const { getCourseProgress, getCompletedVideos, isVideoCompleted } = useVideoProgress();

  // ── Get REAL videos from the enrolled course data ─────────────
  const getCourseVideos = (course: any) => {
    return course?.resources?.videos || [];
  };

  // ── Get REAL pdfs/notes from course data ──────────────────────
  const getCourseNotes = (course: any) => {
    const pdfs = course?.resources?.pdfs || [];
    const links = course?.resources?.links || [];
    return [...pdfs, ...links];
  };

  // ── Get REAL progress from VideoProgressContext ───────────────
  const getRealProgress = (course: any) => {
    return getCourseProgress(course.title);
  };

  // ── Get labs specific to this course's category ────────────────
  const getLabsForCourse = (course: any) => {
    const category = course?.category || "";
    const match = COURSE_LABS[category];
    return match ? match.labs : DEFAULT_LABS.labs;
  };

  // ── Get starter code for a lab based on course category ───────
  const getLabStarter = (labTitle: string, courseCategory: string) => {
    const match = COURSE_LABS[courseCategory];
    if (match?.starters[labTitle]) return match.starters[labTitle];
    return `// ${labTitle}\n// Write your code here...\n\nconsole.log("Hello from ${labTitle}!");`;
  };

  // ── Download note ─────────────────────────────────────────────
  const handleDownload = (note: { title: string; url?: string }) => {
    if (note.url) {
      window.open(note.url, "_blank");
    }
  };

  // ── Open video in the real player ─────────────────────────────
  const handleWatchVideo = (video: any, courseTitle: string) => {
    setSelectedVideo(video);
    setSelectedCourseTitle(courseTitle);
    setShowVideoPlayer(true);
  };

  // ── Open Lab modal ────────────────────────────────────────────
  const handleOpenLab = (lab: { title: string }, courseCategory: string) => {
    const starter = getLabStarter(lab.title, courseCategory);
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

      {/* ── VIDEO PLAYER (Real YouTube with tracking) ──────────── */}
      {showVideoPlayer && selectedVideo && (
        <VideoPlayerWithTracking
          isOpen={showVideoPlayer}
          onClose={() => { setShowVideoPlayer(false); setSelectedVideo(null); }}
          videoTitle={selectedVideo.title}
          videoId={selectedVideo.videoId || ""}
          platform={selectedVideo.platform || "YouTube"}
          originalUrl={selectedVideo.url || ""}
          courseTitle={selectedCourseTitle}
        />
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
              {enrolledCourses.map((course, index) => {
                const realProgress = getRealProgress(course);
                const videos = getCourseVideos(course);
                const completedCount = getCompletedVideos(course.title);
                return (
                  <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                    <div className="h-48 bg-gradient-primary relative">
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">{course.category}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-white text-sm mb-2">
                            Progress: {realProgress}% ({completedCount}/{videos.length} videos)
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: `${realProgress}%` }} />
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
                          // Find next unwatched video from REAL course data
                          const nextVideo = videos.find((v: any) => !isVideoCompleted(v.videoId)) || videos[0];
                          if (nextVideo) {
                            handleWatchVideo(nextVideo, course.title);
                          }
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />Continue Learning
                      </Button>
                    </div>
                  </Card>
                );
              })}
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

                {/* Videos Tab — REAL course videos */}
                <TabsContent value="videos" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => {
                      const videos = getCourseVideos(course);
                      return (
                        <Card key={courseIndex} className="p-6">
                          <h3 className="text-lg font-bold mb-4">{course.title} — Video Lectures</h3>
                          {videos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No videos available for this course yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {videos.map((video: any, vIdx: number) => {
                                const completed = isVideoCompleted(video.videoId);
                                return (
                                  <div key={vIdx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                                        {completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{video.title}</h4>
                                        <p className="text-sm text-muted-foreground">{video.platform || "YouTube"}</p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleWatchVideo(video, course.title)}
                                      className="hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-400 transition-colors"
                                    >
                                      <Play className="w-4 h-4 mr-2" />
                                      {completed ? "Rewatch" : "Watch"}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Notes Tab — REAL course resources */}
                <TabsContent value="notes" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => {
                      const notes = getCourseNotes(course);
                      return (
                        <Card key={courseIndex} className="p-6">
                          <h3 className="text-lg font-bold mb-4">{course.title} — Notes & Resources</h3>
                          {notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No resources available for this course yet.</p>
                          ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                              {notes.map((note: any, nIdx: number) => (
                                <div key={nIdx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <div>
                                      <h4 className="font-medium text-sm">{note.title}</h4>
                                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{note.url}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(note)}
                                    className="hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-400 transition-colors"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />Open
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Labs Tab */}
                <TabsContent value="labs" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} — Labs & Assignments</h3>
                        <div className="space-y-4">
                          {getLabsForCourse(course).map((lab) => (
                            <div key={lab.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Code className="w-5 h-5 text-orange-500" />
                                  <div>
                                    <h4 className="font-medium">{lab.title}</h4>
                                    <p className="text-sm text-muted-foreground">{lab.description}</p>
                                  </div>
                                </div>
                                <Badge variant="outline">{lab.status}</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Due: {lab.dueDate}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenLab(lab, course.category || "")}
                                  className="hover:bg-orange-500/10 hover:border-orange-400 hover:text-orange-400 transition-colors"
                                >
                                  <Terminal className="w-4 h-4 mr-2" />Start
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
