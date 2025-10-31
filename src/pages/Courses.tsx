import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Clock, Users, Star, CheckCircle, Play, Wrench, Award, GraduationCap, FileText, Trophy, Video, Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseDashboard from "../components/CourseDashboard";
import { useCourseContext } from "../contexts/CourseContext";

const Courses = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { enrolledCourses, addCourse } = useCourseContext();
  const navigate = useNavigate();

  const courses = [
    // Full Stack Web Development
    {
      title: "Full Stack Web Development Bootcamp",
      instructor: "Angela Yu",
      duration: "16 weeks",
      students: 6789,
      rating: 4.9,
      level: "Beginner",
      category: "Web Development",
      description: "Complete MERN Stack - HTML, CSS, JavaScript, React, Node.js, MongoDB",
      resources: {
        videos: [
          { title: "Full Stack Web Dev - 10 Hours", url: "https://www.youtube.com/watch?v=nu_pCVPKzTk", platform: "freeCodeCamp" },
          { title: "React Full Course 2024", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA", platform: "freeCodeCamp" },
          { title: "Node.js & Express Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", platform: "freeCodeCamp" },
          { title: "MongoDB Complete Tutorial", url: "https://www.youtube.com/watch?v=c2M-rlkkT5o", platform: "Traversy Media" },
          { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", platform: "freeCodeCamp" }
        ],
        pdfs: [
          { title: "Eloquent JavaScript (Free Book)", url: "https://eloquentjavascript.net/" },
          { title: "You Don't Know JS (Free)", url: "https://github.com/getify/You-Dont-Know-JS" },
          { title: "React Documentation", url: "https://react.dev/learn" },
          { title: "Node.js Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices" }
        ],
        links: [
          { title: "freeCodeCamp Full Stack", url: "https://www.freecodecamp.org/learn/" },
          { title: "The Odin Project", url: "https://www.theodinproject.com/" },
          { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
          { title: "W3Schools", url: "https://www.w3schools.com/" },
          { title: "Frontend Mentor (Practice)", url: "https://www.frontendmentor.io/" }
        ]
      }
    },
    
    // Cloud & DevOps
    {
      title: "Cloud Computing Fundamentals",
      instructor: "Dr. Rajesh Kumar",
      duration: "12 weeks",
      students: 3245,
      rating: 4.9,
      level: "Beginner",
      category: "Cloud & DevOps",
      description: "Master AWS, Azure, and GCP fundamentals",
      resources: {
        videos: [
          { title: "AWS Full Course", url: "https://www.youtube.com/watch?v=ulprqHHWlng", platform: "freeCodeCamp" },
          { title: "Azure Fundamentals", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", platform: "Microsoft" },
          { title: "GCP Complete Course", url: "https://www.youtube.com/watch?v=jpno8FSqpc8", platform: "Edureka" }
        ],
        pdfs: [
          { title: "AWS Cloud Practitioner Guide", url: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf" },
          { title: "Azure Fundamentals PDF", url: "https://azure.microsoft.com/en-us/resources/" }
        ],
        links: [
          { title: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
          { title: "Azure Learn", url: "https://learn.microsoft.com/en-us/azure/" },
          { title: "GCP Documentation", url: "https://cloud.google.com/docs" }
        ]
      }
    },
    {
      title: "DevOps Engineering Complete Guide",
      instructor: "Sarah Mitchell",
      duration: "14 weeks",
      students: 2890,
      rating: 4.8,
      level: "Intermediate",
      category: "Cloud & DevOps",
      description: "CI/CD, Docker, Kubernetes, Jenkins",
      resources: {
        videos: [
          { title: "Docker Full Course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", platform: "TechWorld with Nana" },
          { title: "Kubernetes Tutorial", url: "https://www.youtube.com/watch?v=X48VuDVv0do", platform: "TechWorld with Nana" },
          { title: "Jenkins Complete Course", url: "https://www.youtube.com/watch?v=FX322RVNGj4", platform: "Simplilearn" }
        ],
        pdfs: [
          { title: "Docker Handbook", url: "https://www.freecodecamp.org/news/the-docker-handbook/" },
          { title: "Kubernetes Guide", url: "https://kubernetes.io/docs/home/" }
        ],
        links: [
          { title: "Docker Documentation", url: "https://docs.docker.com/" },
          { title: "Kubernetes Official", url: "https://kubernetes.io/" },
          { title: "Jenkins Docs", url: "https://www.jenkins.io/doc/" }
        ]
      }
    },
    
    // AI & Machine Learning
    {
      title: "Artificial Intelligence Masterclass",
      instructor: "Prof. Andrew Chen",
      duration: "16 weeks",
      students: 4567,
      rating: 4.9,
      level: "Intermediate",
      category: "AI & ML",
      description: "Complete AI from basics to advanced",
      resources: {
        videos: [
          { title: "AI Full Course - Stanford", url: "https://www.youtube.com/watch?v=J8Eh7RqggsU", platform: "Stanford" },
          { title: "Machine Learning by Andrew Ng", url: "https://www.coursera.org/learn/machine-learning", platform: "Coursera (Free Audit)" },
          { title: "AI for Everyone", url: "https://www.youtube.com/watch?v=mJeNghZXtMo", platform: "freeCodeCamp" }
        ],
        pdfs: [
          { title: "AI: A Modern Approach", url: "http://aima.cs.berkeley.edu/" },
          { title: "Deep Learning Book", url: "https://www.deeplearningbook.org/" }
        ],
        links: [
          { title: "Fast.ai Free Course", url: "https://www.fast.ai/" },
          { title: "Google AI Education", url: "https://ai.google/education/" },
          { title: "MIT OpenCourseWare AI", url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/" }
        ]
      }
    },
    {
      title: "Deep Learning & Neural Networks",
      instructor: "Dr. Emily Watson",
      duration: "18 weeks",
      students: 3421,
      rating: 4.9,
      level: "Advanced",
      category: "AI & ML",
      description: "TensorFlow, PyTorch, CNNs, RNNs, GANs"
    },
    {
      title: "Big Data Analytics & Processing",
      instructor: "Michael Zhang",
      duration: "14 weeks",
      students: 2678,
      rating: 4.7,
      level: "Intermediate",
      category: "Data Science",
      description: "Hadoop, Spark, Data Warehousing"
    },
    
    // Emerging Technologies
    {
      title: "Blockchain Technology & Development",
      instructor: "Alex Thompson",
      duration: "12 weeks",
      students: 2134,
      rating: 4.8,
      level: "Intermediate",
      category: "Blockchain",
      description: "Smart Contracts, DApps, Web3"
    },
    {
      title: "Internet of Things (IoT) Complete",
      instructor: "Dr. Priya Sharma",
      duration: "10 weeks",
      students: 1890,
      rating: 4.7,
      level: "Beginner",
      category: "IoT",
      description: "Arduino, Raspberry Pi, IoT Protocols"
    },
    {
      title: "AR/VR Development Fundamentals",
      instructor: "James Wilson",
      duration: "12 weeks",
      students: 1567,
      rating: 4.8,
      level: "Intermediate",
      category: "AR/VR",
      description: "Unity, Unreal Engine, Meta Quest"
    },
    
    // Programming
    {
      title: "Python Programming Complete Course",
      instructor: "Dr. Lisa Anderson",
      duration: "10 weeks",
      students: 5234,
      rating: 4.9,
      level: "Beginner",
      category: "Programming",
      description: "From basics to advanced Python",
      resources: {
        videos: [
          { title: "Python Full Course - 12 Hours", url: "https://www.youtube.com/watch?v=8DvywoWv6fI", platform: "freeCodeCamp" },
          { title: "Python for Beginners", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "Programming with Mosh" },
          { title: "CS50 Python", url: "https://www.youtube.com/watch?v=nLRL_NcnK-4", platform: "Harvard" }
        ],
        pdfs: [
          { title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
          { title: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/" },
          { title: "Think Python Book", url: "https://greenteapress.com/wp/think-python-2e/" }
        ],
        links: [
          { title: "Python.org", url: "https://www.python.org/" },
          { title: "Real Python Tutorials", url: "https://realpython.com/" },
          { title: "W3Schools Python", url: "https://www.w3schools.com/python/" }
        ]
      }
    },
    {
      title: "Advanced Python for Data Science",
      instructor: "Robert Kim",
      duration: "12 weeks",
      students: 3456,
      rating: 4.8,
      level: "Advanced",
      category: "Programming",
      description: "NumPy, Pandas, Matplotlib, Scikit-learn"
    },
    
    // Cybersecurity
    {
      title: "Cybersecurity Fundamentals",
      instructor: "Col. David Miller",
      duration: "14 weeks",
      students: 3890,
      rating: 4.9,
      level: "Beginner",
      category: "Cybersecurity",
      description: "Network Security, Cryptography, Security+",
      resources: {
        videos: [
          { title: "Cybersecurity Full Course", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", platform: "freeCodeCamp" },
          { title: "Network Security", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", platform: "Professor Messer" },
          { title: "Ethical Hacking Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", platform: "freeCodeCamp" }
        ],
        pdfs: [
          { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
          { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }
        ],
        links: [
          { title: "Cybrary Free Courses", url: "https://www.cybrary.it/" },
          { title: "TryHackMe", url: "https://tryhackme.com/" },
          { title: "HackTheBox Academy", url: "https://academy.hackthebox.com/" }
        ]
      }
    },
    {
      title: "Ethical Hacking & Penetration Testing",
      instructor: "Kevin Roberts",
      duration: "16 weeks",
      students: 2987,
      rating: 4.9,
      level: "Advanced",
      category: "Cybersecurity",
      description: "CEH, OSCP, Bug Bounty Hunting"
    },
    {
      title: "Blockchain Security & Auditing",
      instructor: "Dr. Maria Garcia",
      duration: "10 weeks",
      students: 1456,
      rating: 4.7,
      level: "Advanced",
      category: "Blockchain",
      description: "Smart Contract Security, DeFi Audits"
    },
    
    // Future Technologies
    {
      title: "Quantum Computing Fundamentals",
      instructor: "Prof. Richard Feynman Jr.",
      duration: "12 weeks",
      students: 987,
      rating: 4.8,
      level: "Advanced",
      category: "Quantum Tech",
      description: "Qubits, Quantum Algorithms, IBM Qiskit"
    },
    {
      title: "Advanced Cyber Defense & Forensics",
      instructor: "Agent Sarah Connor",
      duration: "18 weeks",
      students: 2345,
      rating: 4.9,
      level: "Advanced",
      category: "Cybersecurity",
      description: "Incident Response, Malware Analysis, DFIR"
    },
    
    // Generative AI
    {
      title: "Generative AI & Large Language Models",
      instructor: "Dr. Sam Altman",
      duration: "14 weeks",
      students: 4890,
      rating: 4.9,
      level: "Intermediate",
      category: "AI & ML",
      description: "GPT, DALL-E, Stable Diffusion, Prompt Engineering"
    },
    {
      title: "AI Agents & Automation",
      instructor: "Marcus Johnson",
      duration: "12 weeks",
      students: 3234,
      rating: 4.8,
      level: "Advanced",
      category: "AI & ML",
      description: "LangChain, AutoGPT, AI Workflows"
    }
  ];

  // Competitive Exams
  const competitiveExams = [
    {
      name: "GATE (Graduate Aptitude Test)",
      category: "Engineering",
      subjects: ["CS", "EC", "EE", "ME", "CE"],
      duration: "6 months prep",
      icon: GraduationCap
    },
    {
      name: "GRE (Graduate Record Examination)",
      category: "International",
      subjects: ["Verbal", "Quant", "Analytical Writing"],
      duration: "4 months prep",
      icon: Award
    },
    {
      name: "TOEFL/IELTS",
      category: "International",
      subjects: ["Reading", "Writing", "Listening", "Speaking"],
      duration: "3 months prep",
      icon: FileText
    },
    {
      name: "UPSC (Civil Services)",
      category: "Government",
      subjects: ["Prelims", "Mains", "Interview"],
      duration: "12 months prep",
      icon: Trophy
    },
    {
      name: "SSC CGL/CHSL",
      category: "Government",
      subjects: ["Reasoning", "Quant", "English", "GK"],
      duration: "6 months prep",
      icon: FileText
    },
    {
      name: "Banking Exams (IBPS/SBI)",
      category: "Government",
      subjects: ["Reasoning", "Quant", "English", "Banking Awareness"],
      duration: "5 months prep",
      icon: Award
    },
    {
      name: "CAT/XAT/GMAT",
      category: "Management",
      subjects: ["Quant", "Verbal", "DILR"],
      duration: "8 months prep",
      icon: GraduationCap
    },
    {
      name: "Coding Interviews (FAANG)",
      category: "Private Sector",
      subjects: ["DSA", "System Design", "Problem Solving"],
      duration: "6 months prep",
      icon: Trophy
    },
    {
      name: "AWS/Azure/GCP Certifications",
      category: "IT Certifications",
      subjects: ["Cloud Architecture", "DevOps", "Security"],
      duration: "3 months prep",
      icon: Award
    },
    {
      name: "Online Coding Contests",
      category: "Competitive Programming",
      subjects: ["Codeforces", "LeetCode", "HackerRank"],
      duration: "Ongoing",
      icon: Trophy
    }
  ];

  const handleEnroll = (course: any) => {
    setSelectedCourse(course);
    // Add course to enrolled courses using context
    addCourse(course);
    // Show success dialog
    setShowSuccessDialog(true);
  };

  const handleViewResources = (course: any) => {
    setSelectedCourse(course);
    setShowResourcesDialog(true);
  };

  const handleViewDashboard = () => {
    setShowDashboard(true);
    setShowSuccessDialog(false);
  };

  if (showDashboard) {
    return <CourseDashboard enrolledCourses={enrolledCourses} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
                <p className="text-muted-foreground text-lg">
                  Choose from our curated selection of engaging courses
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/ai-tools')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  AI Tools
                </Button>
                <Button 
                  onClick={() => setShowDashboard(true)}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Course Dashboard
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              // Map categories to consistent Unsplash image topics
              const getCategoryImage = (category: string) => {
                const imageMap: { [key: string]: string } = {
                  "Web Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
                  "Cloud & DevOps": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
                  "AI & ML": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
                  "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
                  "Blockchain": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
                  "IoT": "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&h=400&fit=crop",
                  "AR/VR": "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop",
                  "Programming": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop",
                  "Cybersecurity": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
                  "Quantum Tech": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop"
                };
                return imageMap[category] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop";
              };
              
              return (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={getCategoryImage(course.category)} 
                    alt={course.category}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                  <p className="text-xs text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEnroll(course)}
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      Enroll Now
                    </Button>
                    {course.resources && (
                      <Button 
                        onClick={() => handleViewResources(course)}
                        variant="outline"
                        size="icon"
                        className="hover:bg-primary hover:text-primary-foreground"
                        title="View Free Resources"
                      >
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
            })}
          </div>

          {/* Competitive Exams Section - ENERGETIC VERSION */}
          <div className="mt-20 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-3xl blur-3xl -z-10" />
            
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg animate-pulse">
                <Trophy className="w-8 h-8 text-white animate-bounce" />
                <h2 className="text-3xl font-black text-white tracking-tight">
                  COMPETITIVE EXAMS
                </h2>
                <Trophy className="w-8 h-8 text-white animate-bounce" />
              </div>
              <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🚀 Crack GATE, GRE, UPSC & Land Your Dream Job! 🎯
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {competitiveExams.map((exam, index) => {
                const Icon = exam.icon;
                const gradients = [
                  'from-purple-500 to-pink-500',
                  'from-blue-500 to-cyan-500',
                  'from-green-500 to-emerald-500',
                  'from-orange-500 to-red-500',
                  'from-yellow-500 to-orange-500',
                  'from-indigo-500 to-purple-500',
                  'from-pink-500 to-rose-500',
                  'from-teal-500 to-green-500',
                  'from-red-500 to-pink-500',
                  'from-cyan-500 to-blue-500',
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <Card 
                    key={index} 
                    className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border-0"
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                    
                    <div className="relative p-5">
                      {/* Icon with Glow */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                            {exam.name}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs font-semibold bg-gradient-to-r ${gradient} text-white border-0`}
                          >
                            {exam.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Duration with Icon */}
                      <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{exam.duration}</span>
                      </div>
                      
                      {/* Subjects Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exam.subjects.map((subject, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs font-semibold hover:scale-110 transition-transform cursor-default"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* CTA Button with Gradient */}
                      <Button 
                        size="sm"
                        className={`w-full bg-gradient-to-r ${gradient} text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          🔥 Start Now
                        </span>
                      </Button>
                    </div>
                    
                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Card>
                );
              })}
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <Star className="w-5 h-5 text-yellow-300 animate-spin" />
                <span className="text-white font-bold text-lg">View All Exam Resources →</span>
                <Star className="w-5 h-5 text-yellow-300 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Successfully Enrolled!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground mb-4">
              You have successfully enrolled in the course. You can now access your course materials.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleViewDashboard}
                className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Play className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Free Resources Dialog */}
      <Dialog open={showResourcesDialog} onOpenChange={setShowResourcesDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-7 h-7 text-primary" />
              Free Learning Resources
            </DialogTitle>
            {selectedCourse && (
              <p className="text-sm text-muted-foreground mt-2">
                {selectedCourse.title} - All resources are 100% free and legal
              </p>
            )}
          </DialogHeader>
          
          {selectedCourse?.resources && (
            <div className="space-y-6 py-4">
              {/* Video Lectures */}
              {selectedCourse.resources.videos && selectedCourse.resources.videos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-lg">Video Lectures</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.videos.map((video: any, idx: number) => (
                      <a
                        key={idx}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:border-primary transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <Play className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary">{video.title}</p>
                            <p className="text-xs text-muted-foreground">{video.platform}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Resources */}
              {selectedCourse.resources.pdfs && selectedCourse.resources.pdfs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-lg">PDF Books & Guides</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.pdfs.map((pdf: any, idx: number) => (
                      <a
                        key={idx}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:border-primary transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="font-medium group-hover:text-primary">{pdf.title}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Useful Links */}
              {selectedCourse.resources.links && selectedCourse.resources.links.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-lg">Official Documentation & Websites</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.links.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:border-primary transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="font-medium group-hover:text-primary">{link.title}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-center">
                  🎓 <strong>All resources are completely FREE and from legitimate sources</strong> like YouTube, official documentation, and open-source books. Happy learning! 🚀
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowResourcesDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleEnroll(selectedCourse);
                setShowResourcesDialog(false);
              }}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              Enroll in Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Courses;
