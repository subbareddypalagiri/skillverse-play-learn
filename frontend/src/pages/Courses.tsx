import PageLayout from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Clock, Users, Star, CheckCircle, Play, Wrench, Award, GraduationCap, FileText, Trophy, Video, Download, ExternalLink, Monitor, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseDashboard from "../components/CourseDashboard";
import VideoPlayerWithTracking from "../components/VideoPlayerWithTracking";
import CourseCertificate from "../components/CourseCertificate";
import { useCourseContext } from "../contexts/CourseContext";
import { useVideoProgress } from "../contexts/VideoProgressContext";
import apiClient from "@/lib/apiClient";

const Courses = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enrolledCourses, addCourse } = useCourseContext();
  const { isCourseCompleted, getCompletedVideos, isVideoCompleted } = useVideoProgress();
  const navigate = useNavigate();

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/courses?limit=100');
        // Handle both response formats (paginated puts array directly in data)
        const rawData = response.data.data;
        const coursesArray = Array.isArray(rawData) ? rawData : (rawData?.courses || []);
        
        // Transform backend fields to match frontend expectations
        const transformedCourses = coursesArray.map((course: any) => ({
          ...course,
          // Use instructor field directly, or fall back to ownerId.name
          instructor: course.instructor || course.ownerId?.name || 'Unknown Instructor',
          // Map enrollmentCount to students for the UI
          students: course.enrollmentCount || course.students || 0,
          // Ensure rating has a value
          rating: course.rating || 4.5,
        }));
        
        // Use backend data if available, otherwise fall back to defaultCourses
        if (transformedCourses.length > 0) {
          setCourses(transformedCourses);
        } else {
          setCourses(defaultCourses);
        }
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch courses:', err);
        // Fall back to defaultCourses instead of showing empty state
        setCourses(defaultCourses);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const defaultCourses = [
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
          { title: "Full Stack Web Dev - 10 Hours", url: "https://www.youtube.com/watch?v=nu_pCVPKzTk", platform: "YouTube", videoId: "nu_pCVPKzTk" },
          { title: "React Full Course 2024", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA", platform: "YouTube", videoId: "CgkZ7MvWUAA" },
          { title: "Node.js & Express Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", platform: "YouTube", videoId: "Oe421EPjeBE" },
          { title: "MongoDB Complete Tutorial", url: "https://www.youtube.com/watch?v=c2M-rlkkT5o", platform: "YouTube", videoId: "c2M-rlkkT5o" },
          { title: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", platform: "YouTube", videoId: "PkZNo7MFNFg" }
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
          { title: "AWS Full Course", url: "https://www.youtube.com/watch?v=ulprqHHWlng", platform: "YouTube", videoId: "ulprqHHWlng" },
          { title: "Azure Fundamentals", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", platform: "YouTube", videoId: "NKEFWyqJ5XA" },
          { title: "GCP Complete Course", url: "https://www.youtube.com/watch?v=jpno8FSqpc8", platform: "YouTube", videoId: "jpno8FSqpc8" }
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
          { title: "Docker Full Course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", platform: "YouTube", videoId: "3c-iBn73dDE" },
          { title: "Kubernetes Tutorial", url: "https://www.youtube.com/watch?v=X48VuDVv0do", platform: "YouTube", videoId: "X48VuDVv0do" },
          { title: "Jenkins Complete Course", url: "https://www.youtube.com/watch?v=FX322RVNGj4", platform: "YouTube", videoId: "FX322RVNGj4" }
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
          { title: "AI Full Course - Stanford", url: "https://www.youtube.com/watch?v=J8Eh7RqggsU", platform: "YouTube", videoId: "J8Eh7RqggsU" },
          { title: "Machine Learning by Andrew Ng", url: "https://www.coursera.org/learn/machine-learning", platform: "Coursera" },
          { title: "AI for Everyone", url: "https://www.youtube.com/watch?v=mJeNghZXtMo", platform: "YouTube", videoId: "mJeNghZXtMo" }
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
      description: "TensorFlow, PyTorch, CNNs, RNNs, GANs",
      resources: {
        videos: [
          { title: "Deep Learning Specialization - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs69/preview", platform: "NPTEL", videoId: "noc23_cs69" },
          { title: "Deep Learning Full Course", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", platform: "YouTube", videoId: "VyWAvY2CF9c" },
          { title: "Neural Networks Explained", url: "https://www.youtube.com/watch?v=aircAruvnKk", platform: "YouTube", videoId: "aircAruvnKk" },
          { title: "PyTorch Complete Course", url: "https://www.youtube.com/watch?v=c36lUUr864M", platform: "YouTube", videoId: "c36lUUr864M" },
          { title: "TensorFlow 2.0 Full Tutorial", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", platform: "YouTube", videoId: "tPYj3fFJGjk" }
        ],
        pdfs: [
          { title: "Deep Learning Book (Ian Goodfellow)", url: "https://www.deeplearningbook.org/" },
          { title: "Neural Networks and Deep Learning", url: "http://neuralnetworksanddeeplearning.com/" },
          { title: "Dive into Deep Learning", url: "https://d2l.ai/" },
          { title: "PyTorch Documentation", url: "https://pytorch.org/docs/stable/index.html" }
        ],
        links: [
          { title: "NPTEL Deep Learning Course", url: "https://nptel.ac.in/courses/106105152" },
          { title: "Stanford CS230", url: "https://cs230.stanford.edu/" },
          { title: "Fast.ai Practical Deep Learning", url: "https://course.fast.ai/" },
          { title: "Papers with Code", url: "https://paperswithcode.com/" }
        ]
      }
    },
    {
      title: "Big Data Analytics & Processing",
      instructor: "Michael Zhang",
      duration: "14 weeks",
      students: 2678,
      rating: 4.7,
      level: "Intermediate",
      category: "Data Science",
      description: "Hadoop, Spark, Data Warehousing",
      resources: {
        videos: [
          { title: "Big Data Computing - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_cs106/preview", platform: "NPTEL", videoId: "24_cs106" },
          { title: "Hadoop Full Course", url: "https://www.youtube.com/watch?v=1vbXmCrkT3Y", platform: "YouTube", videoId: "1vbXmCrkT3Y" },
          { title: "Apache Spark Tutorial", url: "https://www.youtube.com/watch?v=zC9cnh8rJd0", platform: "YouTube", videoId: "zC9cnh8rJd0" },
          { title: "Big Data Analytics with Python", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", platform: "YouTube", videoId: "r-uOLxNrNk8" },
          { title: "Data Warehousing Tutorial", url: "https://www.youtube.com/watch?v=J326LIUrZM8", platform: "YouTube", videoId: "J326LIUrZM8" }
        ],
        pdfs: [
          { title: "Hadoop: The Definitive Guide", url: "https://github.com/onlinebook24/book/blob/master/Hadoop_%20The%20Definitive%20Guide.pdf" },
          { title: "Learning Spark", url: "https://pages.databricks.com/rs/094-YMS-629/images/LearningSpark2.0.pdf" },
          { title: "Big Data Analytics Guide", url: "https://www.oreilly.com/library/view/big-data-analytics/" },
          { title: "Apache Spark Documentation", url: "https://spark.apache.org/docs/latest/" }
        ],
        links: [
          { title: "NPTEL Big Data Course", url: "https://nptel.ac.in/courses/106106184" },
          { title: "Apache Hadoop Docs", url: "https://hadoop.apache.org/docs/" },
          { title: "Databricks Academy", url: "https://www.databricks.com/learn" },
          { title: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
        ]
      }
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
      description: "Smart Contracts, DApps, Web3",
      resources: {
        videos: [
          { title: "Blockchain Architecture Design - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_cs75/preview", platform: "NPTEL", videoId: "24_cs75" },
          { title: "Blockchain Full Course", url: "https://www.youtube.com/watch?v=QCvL-DWcojc", platform: "YouTube", videoId: "QCvL-DWcojc" },
          { title: "Solidity Full Course", url: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", platform: "YouTube", videoId: "gyMwXuJrbJQ" },
          { title: "Web3.js Complete Tutorial", url: "https://www.youtube.com/watch?v=t3wM5903ty0", platform: "YouTube", videoId: "t3wM5903ty0" },
          { title: "Smart Contracts Development", url: "https://www.youtube.com/watch?v=M576WGiDBdQ", platform: "YouTube", videoId: "M576WGiDBdQ" }
        ],
        pdfs: [
          { title: "Mastering Blockchain (Free)", url: "https://github.com/PacktPublishing/Mastering-Blockchain-Third-Edition" },
          { title: "Blockchain Basics", url: "https://arxiv.org/pdf/1612.06244.pdf" },
          { title: "Ethereum Whitepaper", url: "https://ethereum.org/en/whitepaper/" },
          { title: "Solidity Documentation", url: "https://docs.soliditylang.org/" }
        ],
        links: [
          { title: "NPTEL Blockchain Course", url: "https://nptel.ac.in/courses/106105194" },
          { title: "Ethereum.org Learn", url: "https://ethereum.org/en/developers/" },
          { title: "Web3 University", url: "https://www.web3.university/" },
          { title: "CryptoZombies Tutorial", url: "https://cryptozombies.io/" }
        ]
      }
    },
    {
      title: "Internet of Things (IoT) Complete",
      instructor: "Dr. Priya Sharma",
      duration: "10 weeks",
      students: 1890,
      rating: 4.7,
      level: "Beginner",
      category: "IoT",
      description: "Arduino, Raspberry Pi, IoT Protocols",
      resources: {
        videos: [
          { title: "Introduction to IoT - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs97/preview", platform: "NPTEL", videoId: "23_cs97" },
          { title: "IoT Full Course", url: "https://www.youtube.com/watch?v=LlhmzVL5bm8", platform: "YouTube", videoId: "LlhmzVL5bm8" },
          { title: "Arduino Tutorial for Beginners", url: "https://www.youtube.com/watch?v=zJ-LqeX_fLU", platform: "YouTube", videoId: "zJ-LqeX_fLU" },
          { title: "Raspberry Pi Complete Course", url: "https://www.youtube.com/watch?v=QRCUoTTqC_0", platform: "YouTube", videoId: "QRCUoTTqC_0" },
          { title: "IoT Protocols Explained", url: "https://www.youtube.com/watch?v=F3ux8R-jE9Y", platform: "YouTube", videoId: "F3ux8R-jE9Y" }
        ],
        pdfs: [
          { title: "IoT Fundamentals Guide", url: "https://www.cisco.com/c/dam/en_us/solutions/industries/docs/education/IoT_Fundamentals_IoT_FoE_Course_Overview.pdf" },
          { title: "Arduino Cookbook", url: "https://www.pdfdrive.com/arduino-cookbook-e158863714.html" },
          { title: "Raspberry Pi User Guide", url: "https://www.raspberrypi.com/documentation/" },
          { title: "IoT Architecture Guide", url: "https://www.oreilly.com/library/view/designing-the-internet/" }
        ],
        links: [
          { title: "NPTEL IoT Course", url: "https://nptel.ac.in/courses/106105166" },
          { title: "Arduino Official", url: "https://www.arduino.cc/en/Tutorial/HomePage" },
          { title: "Raspberry Pi Projects", url: "https://projects.raspberrypi.org/" },
          { title: "IoT for All", url: "https://www.iotforall.com/" }
        ]
      }
    },
    {
      title: "AR/VR Development Fundamentals",
      instructor: "James Wilson",
      duration: "12 weeks",
      students: 1567,
      rating: 4.8,
      level: "Intermediate",
      category: "AR/VR",
      description: "Unity, Unreal Engine, Meta Quest",
      resources: {
        videos: [
          { title: "Virtual Reality - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs98/preview", platform: "NPTEL", videoId: "23_cs98" },
          { title: "Unity VR Development", url: "https://www.youtube.com/watch?v=gGYtahQjmWQ", platform: "YouTube", videoId: "gGYtahQjmWQ" },
          { title: "Unreal Engine VR Tutorial", url: "https://www.youtube.com/watch?v=wKU0sKZ8h_M", platform: "YouTube", videoId: "wKU0sKZ8h_M" },
          { title: "AR Development with Unity", url: "https://www.youtube.com/watch?v=FWyTf3USDCQ", platform: "YouTube", videoId: "FWyTf3USDCQ" },
          { title: "Meta Quest Development", url: "https://www.youtube.com/watch?v=XFljMJ2BdAI", platform: "YouTube", videoId: "XFljMJ2BdAI" }
        ],
        pdfs: [
          { title: "Unity VR Documentation", url: "https://docs.unity3d.com/Manual/VROverview.html" },
          { title: "AR/VR Development Guide", url: "https://developer.oculus.com/documentation/" },
          { title: "Unreal Engine VR Guide", url: "https://docs.unrealengine.com/en-US/SharingAndReleasing/XRDevelopment/VR/" },
          { title: "ARCore Documentation", url: "https://developers.google.com/ar" }
        ],
        links: [
          { title: "NPTEL VR Course", url: "https://nptel.ac.in/courses/106104191" },
          { title: "Unity Learn VR", url: "https://learn.unity.com/course/create-with-vr" },
          { title: "Meta for Developers", url: "https://developer.oculus.com/" },
          { title: "ARKit Apple", url: "https://developer.apple.com/augmented-reality/" }
        ]
      }
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
          { title: "Python Full Course - 12 Hours", url: "https://www.youtube.com/watch?v=8DvywoWv6fI", platform: "YouTube", videoId: "8DvywoWv6fI" },
          { title: "Python for Beginners", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "YouTube", videoId: "rfscVS0vtbw" },
          { title: "CS50 Python", url: "https://www.youtube.com/watch?v=nLRL_NcnK-4", platform: "YouTube", videoId: "nLRL_NcnK-4" }
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
      description: "NumPy, Pandas, Matplotlib, Scikit-learn",
      resources: {
        videos: [
          { title: "Python for Data Science - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_cs94/preview", platform: "NPTEL", videoId: "24_cs94" },
          { title: "Data Science with Python", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", platform: "YouTube", videoId: "ua-CiDNNj30" },
          { title: "NumPy Full Tutorial", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", platform: "YouTube", videoId: "QUT1VHiLmmI" },
          { title: "Pandas Complete Course", url: "https://www.youtube.com/watch?v=vmEHCJofslg", platform: "YouTube", videoId: "vmEHCJofslg" },
          { title: "Machine Learning with Scikit-Learn", url: "https://www.youtube.com/watch?v=pqNCD_5r0IU", platform: "YouTube", videoId: "pqNCD_5r0IU" }
        ],
        pdfs: [
          { title: "Python Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
          { title: "NumPy User Guide", url: "https://numpy.org/doc/stable/user/index.html" },
          { title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
          { title: "Scikit-Learn User Guide", url: "https://scikit-learn.org/stable/user_guide.html" }
        ],
        links: [
          { title: "NPTEL Data Science Course", url: "https://nptel.ac.in/courses/106106145" },
          { title: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
          { title: "DataCamp Free Courses", url: "https://www.datacamp.com/courses" },
          { title: "Real Python Data Science", url: "https://realpython.com/tutorials/data-science/" }
        ]
      }
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
          { title: "Cybersecurity Full Course", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", platform: "YouTube", videoId: "U_P23SqJaDc" },
          { title: "Network Security", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", platform: "YouTube", videoId: "qiQR5rTSshw" },
          { title: "Ethical Hacking Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", platform: "YouTube", videoId: "3Kq1MIfTWCE" }
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
      description: "CEH, OSCP, Bug Bounty Hunting",
      resources: {
        videos: [
          { title: "Ethical Hacking - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs72/preview", platform: "NPTEL", videoId: "23_cs72" },
          { title: "Ethical Hacking Full Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", platform: "YouTube", videoId: "3Kq1MIfTWCE" },
          { title: "Penetration Testing Bootcamp", url: "https://www.youtube.com/watch?v=WnN6dbos5u8", platform: "YouTube", videoId: "WnN6dbos5u8" },
          { title: "Bug Bounty Hunting", url: "https://www.youtube.com/watch?v=Rp69edBmFFo", platform: "YouTube", videoId: "Rp69edBmFFo" },
          { title: "Kali Linux Tutorial", url: "https://www.youtube.com/watch?v=lZAoFs75_cs", platform: "YouTube", videoId: "lZAoFs75_cs" }
        ],
        pdfs: [
          { title: "The Web Application Hacker's Handbook", url: "https://edu.anarcho-copy.org/Against%20Security%20-%20Self%20Security/Dafydd%20Stuttard,%20Marcus%20Pinto%20-%20The%20web%20application%20hackers%20handbook.pdf" },
          { title: "Penetration Testing Guide", url: "https://www.offensive-security.com/pwk-oscp/" },
          { title: "OWASP Testing Guide", url: "https://owasp.org/www-project-web-security-testing-guide/" },
          { title: "Metasploit Unleashed", url: "https://www.offensive-security.com/metasploit-unleashed/" }
        ],
        links: [
          { title: "NPTEL Ethical Hacking", url: "https://nptel.ac.in/courses/106105031" },
          { title: "HackTheBox", url: "https://www.hackthebox.com/" },
          { title: "TryHackMe", url: "https://tryhackme.com/" },
          { title: "PortSwigger Academy", url: "https://portswigger.net/web-security" }
        ]
      }
    },
    {
      title: "Blockchain Security & Auditing",
      instructor: "Dr. Maria Garcia",
      duration: "10 weeks",
      students: 1456,
      rating: 4.7,
      level: "Advanced",
      category: "Blockchain",
      description: "Smart Contract Security, DeFi Audits",
      resources: {
        videos: [
          { title: "Blockchain and Security - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_cs76/preview", platform: "NPTEL", videoId: "24_cs76" },
          { title: "Smart Contract Security", url: "https://www.youtube.com/watch?v=pUWmJ86X_do", platform: "YouTube", videoId: "pUWmJ86X_do" },
          { title: "Solidity Security Best Practices", url: "https://www.youtube.com/watch?v=WLD_LcVgJR8", platform: "YouTube", videoId: "WLD_LcVgJR8" },
          { title: "DeFi Security Tutorial", url: "https://www.youtube.com/watch?v=Df2zzfoTfMc", platform: "YouTube", videoId: "Df2zzfoTfMc" },
          { title: "Smart Contract Auditing", url: "https://www.youtube.com/watch?v=TmZ8gH-toX0", platform: "YouTube", videoId: "TmZ8gH-toX0" }
        ],
        pdfs: [
          { title: "Smart Contract Security Best Practices", url: "https://consensys.github.io/smart-contract-best-practices/" },
          { title: "Ethereum Security Guide", url: "https://ethereum.org/en/developers/docs/security/" },
          { title: "DeFi Security Handbook", url: "https://github.com/OffcierCia/DeFi-Developer-Road-Map" },
          { title: "SWC Registry", url: "https://swcregistry.io/" }
        ],
        links: [
          { title: "NPTEL Blockchain Security", url: "https://nptel.ac.in/courses/106106129" },
          { title: "OpenZeppelin Contracts", url: "https://docs.openzeppelin.com/contracts/" },
          { title: "Consensys Diligence", url: "https://consensys.net/diligence/" },
          { title: "Immunefi Bug Bounties", url: "https://immunefi.com/" }
        ]
      }
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
      description: "Qubits, Quantum Algorithms, IBM Qiskit",
      resources: {
        videos: [
          { title: "Quantum Computing - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_ph35/preview", platform: "NPTEL", videoId: "24_ph35" },
          { title: "Quantum Computing Full Course", url: "https://www.youtube.com/watch?v=QuR969uMICM", platform: "YouTube", videoId: "QuR969uMICM" },
          { title: "Introduction to Quantum Computing", url: "https://www.youtube.com/watch?v=tsbCSkvHhMo", platform: "YouTube", videoId: "tsbCSkvHhMo" },
          { title: "IBM Qiskit Tutorial", url: "https://www.youtube.com/watch?v=a1NZC5rqQD8", platform: "YouTube", videoId: "a1NZC5rqQD8" },
          { title: "Quantum Algorithms Explained", url: "https://www.youtube.com/watch?v=F_Riqjdh2oM", platform: "YouTube", videoId: "F_Riqjdh2oM" }
        ],
        pdfs: [
          { title: "Quantum Computing for Everyone", url: "https://quantum.country/qcvc" },
          { title: "IBM Quantum Learning", url: "https://learning.quantum.ibm.com/" },
          { title: "Qiskit Textbook", url: "https://qiskit.org/textbook/preface.html" },
          { title: "Quantum Algorithm Zoo", url: "https://quantumalgorithmzoo.org/" }
        ],
        links: [
          { title: "NPTEL Quantum Computing", url: "https://nptel.ac.in/courses/115106065" },
          { title: "IBM Quantum Experience", url: "https://quantum-computing.ibm.com/" },
          { title: "Microsoft Quantum", url: "https://azure.microsoft.com/en-us/products/quantum/" },
          { title: "Quantum Open Source Foundation", url: "https://qosf.org/" }
        ]
      }
    },
    {
      title: "Advanced Cyber Defense & Forensics",
      instructor: "Agent Sarah Connor",
      duration: "18 weeks",
      students: 2345,
      rating: 4.9,
      level: "Advanced",
      category: "Cybersecurity",
      description: "Incident Response, Malware Analysis, DFIR",
      resources: {
        videos: [
          { title: "Cyber Security and Privacy - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs73/preview", platform: "NPTEL", videoId: "23_cs73" },
          { title: "Digital Forensics Full Course", url: "https://www.youtube.com/watch?v=0HX94eWcGGQ", platform: "YouTube", videoId: "0HX94eWcGGQ" },
          { title: "Malware Analysis Tutorial", url: "https://www.youtube.com/watch?v=qJZ-abfQ-GI", platform: "YouTube", videoId: "qJZ-abfQ-GI" },
          { title: "Incident Response Training", url: "https://www.youtube.com/watch?v=9Uo7V6flUxs", platform: "YouTube", videoId: "9Uo7V6flUxs" },
          { title: "Network Forensics", url: "https://www.youtube.com/watch?v=er7_O2BbT8w", platform: "YouTube", videoId: "er7_O2BbT8w" }
        ],
        pdfs: [
          { title: "The Art of Memory Forensics", url: "https://volatility-labs.blogspot.com/" },
          { title: "Incident Response Guide", url: "https://www.sans.org/white-papers/" },
          { title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
          { title: "Malware Analysis Handbook", url: "https://nostarch.com/malware" }
        ],
        links: [
          { title: "NPTEL Cyber Security", url: "https://nptel.ac.in/courses/106105031" },
          { title: "SANS DFIR Resources", url: "https://www.sans.org/digital-forensics-incident-response/" },
          { title: "Digital Forensics Tools", url: "https://www.sleuthkit.org/" },
          { title: "Volatility Framework", url: "https://www.volatilityfoundation.org/" }
        ]
      }
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
      description: "GPT, DALL-E, Stable Diffusion, Prompt Engineering",
      resources: {
        videos: [
          { title: "Generative AI - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc24_cs110/preview", platform: "NPTEL", videoId: "24_cs110" },
          { title: "LLM Full Course", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", platform: "YouTube", videoId: "zjkBMFhNj_g" },
          { title: "ChatGPT & GPT-4 Tutorial", url: "https://www.youtube.com/watch?v=vw-KWfKwvTQ", platform: "YouTube", videoId: "vw-KWfKwvTQ" },
          { title: "Stable Diffusion Complete Guide", url: "https://www.youtube.com/watch?v=DHaL56P6f5M", platform: "YouTube", videoId: "DHaL56P6f5M" },
          { title: "Prompt Engineering Course", url: "https://www.youtube.com/watch?v=_ZvnD73m40o", platform: "YouTube", videoId: "_ZvnD73m40o" }
        ],
        pdfs: [
          { title: "LLM Introduction Guide", url: "https://www.promptingguide.ai/" },
          { title: "Attention Is All You Need Paper", url: "https://arxiv.org/abs/1706.03762" },
          { title: "GPT-3 Paper", url: "https://arxiv.org/abs/2005.14165" },
          { title: "Prompt Engineering Guide", url: "https://github.com/dair-ai/Prompt-Engineering-Guide" }
        ],
        links: [
          { title: "NPTEL Generative AI", url: "https://nptel.ac.in/courses/106106184" },
          { title: "Hugging Face Learn", url: "https://huggingface.co/learn" },
          { title: "OpenAI Cookbook", url: "https://github.com/openai/openai-cookbook" },
          { title: "LangChain Documentation", url: "https://python.langchain.com/docs/" }
        ]
      }
    },
    {
      title: "AI Agents & Automation",
      instructor: "Marcus Johnson",
      duration: "12 weeks",
      students: 3234,
      rating: 4.8,
      level: "Advanced",
      category: "AI & ML",
      description: "LangChain, AutoGPT, AI Workflows",
      resources: {
        videos: [
          { title: "AI and Automation - NPTEL", url: "https://onlinecourses.nptel.ac.in/noc23_cs111/preview", platform: "NPTEL", videoId: "23_cs111" },
          { title: "LangChain Full Tutorial", url: "https://www.youtube.com/watch?v=LbT1yp6quS8", platform: "YouTube", videoId: "LbT1yp6quS8" },
          { title: "AutoGPT Complete Guide", url: "https://www.youtube.com/watch?v=jn8EDKcY74A", platform: "YouTube", videoId: "jn8EDKcY74A" },
          { title: "Building AI Agents", url: "https://www.youtube.com/watch?v=F8NKVhkZZWI", platform: "YouTube", videoId: "F8NKVhkZZWI" },
          { title: "AI Automation with n8n", url: "https://www.youtube.com/watch?v=CeFQFYdomUo", platform: "YouTube", videoId: "CeFQFYdomUo" }
        ],
        pdfs: [
          { title: "LangChain Documentation", url: "https://python.langchain.com/docs/" },
          { title: "AI Agents Survey Paper", url: "https://arxiv.org/abs/2309.07864" },
          { title: "AutoGPT Guide", url: "https://github.com/Significant-Gravitas/AutoGPT" },
          { title: "CrewAI Documentation", url: "https://docs.crewai.com/" }
        ],
        links: [
          { title: "NPTEL AI Course", url: "https://nptel.ac.in/courses/106105152" },
          { title: "LangChain Hub", url: "https://python.langchain.com/" },
          { title: "AutoGPT GitHub", url: "https://github.com/Significant-Gravitas/AutoGPT" },
          { title: "LangGraph Documentation", url: "https://langchain-ai.github.io/langgraph/" }
        ]
      }
    },

    // Data Structures & Algorithms
    {
      title: "Data Structures & Algorithms Masterclass",
      instructor: "NeetCode",
      duration: "16 weeks",
      students: 8920,
      rating: 4.9,
      level: "Intermediate",
      category: "Programming",
      description: "Arrays, Trees, Graphs, DP — crack FAANG interviews",
      resources: {
        videos: [
          { title: "DSA Full Course - freeCodeCamp", url: "https://www.youtube.com/watch?v=8hly31xKli0", platform: "YouTube", videoId: "8hly31xKli0" },
          { title: "NeetCode DSA Roadmap", url: "https://www.youtube.com/watch?v=otvLdDbzP5Y", platform: "YouTube", videoId: "otvLdDbzP5Y" },
          { title: "Graph Algorithms Explained", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", platform: "YouTube", videoId: "09_LlHjoEiY" },
          { title: "Dynamic Programming Patterns", url: "https://www.youtube.com/watch?v=aPQY__2H3tE", platform: "YouTube", videoId: "aPQY__2H3tE" }
        ],
        pdfs: [
          { title: "CLRS Introduction to Algorithms", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
          { title: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" }
        ],
        links: [
          { title: "LeetCode", url: "https://leetcode.com/" },
          { title: "NeetCode.io", url: "https://neetcode.io/" },
          { title: "Codeforces", url: "https://codeforces.com/" }
        ]
      }
    },
    {
      title: "System Design for Software Engineers",
      instructor: "Gaurav Sen",
      duration: "10 weeks",
      students: 5670,
      rating: 4.9,
      level: "Advanced",
      category: "Web Development",
      description: "Scalability, microservices, load balancing, caching, databases at scale",
      resources: {
        videos: [
          { title: "System Design Interview Course", url: "https://www.youtube.com/watch?v=UzLMhqg3_Wc", platform: "YouTube", videoId: "UzLMhqg3_Wc" },
          { title: "System Design Basics", url: "https://www.youtube.com/watch?v=xpDnVSmNnr0", platform: "YouTube", videoId: "xpDnVSmNnr0" },
          { title: "Microservices Architecture", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", platform: "YouTube", videoId: "rv4LlmLmVWk" }
        ],
        pdfs: [
          { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
          { title: "Google SRE Book", url: "https://sre.google/sre-book/table-of-contents/" }
        ],
        links: [
          { title: "ByteByteGo", url: "https://bytebytego.com/" },
          { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" }
        ]
      }
    },
    {
      title: "Next.js Full Stack Development",
      instructor: "Josh Comeau",
      duration: "12 weeks",
      students: 4120,
      rating: 4.9,
      level: "Intermediate",
      category: "Web Development",
      description: "Next.js 14, App Router, Server Components, API routes, deployment",
      resources: {
        videos: [
          { title: "Next.js 14 Full Course", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", platform: "YouTube", videoId: "wm5gMKuwSYk" },
          { title: "Next.js App Router Tutorial", url: "https://www.youtube.com/watch?v=gSSs-Qa3i48", platform: "YouTube", videoId: "gSSs-Qa3i48" }
        ],
        pdfs: [{ title: "Next.js Official Docs", url: "https://nextjs.org/docs" }],
        links: [
          { title: "Next.js Learn", url: "https://nextjs.org/learn" },
          { title: "Vercel Platform", url: "https://vercel.com/" }
        ]
      }
    },
    {
      title: "TypeScript Complete Developer Guide",
      instructor: "Matt Pocock",
      duration: "8 weeks",
      students: 6340,
      rating: 4.9,
      level: "Intermediate",
      category: "Programming",
      description: "Types, generics, utility types, React + TypeScript patterns",
      resources: {
        videos: [
          { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=30LW083Z9pk", platform: "YouTube", videoId: "30LW083Z9pk" },
          { title: "React + TypeScript", url: "https://www.youtube.com/watch?v=FJDVKeh7RJI", platform: "YouTube", videoId: "FJDVKeh7RJI" }
        ],
        pdfs: [{ title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }],
        links: [
          { title: "TypeScript Playground", url: "https://www.typescriptlang.org/play" },
          { title: "Total TypeScript", url: "https://www.totaltypescript.com/" }
        ]
      }
    },
    {
      title: "React Native Mobile App Development",
      instructor: "Simcoder",
      duration: "14 weeks",
      students: 3780,
      rating: 4.8,
      level: "Intermediate",
      category: "Mobile Development",
      description: "Build iOS & Android apps with React Native, Expo, navigation",
      resources: {
        videos: [
          { title: "React Native Full Course 2024", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", platform: "YouTube", videoId: "0-S5a0eXPoc" },
          { title: "Expo Router Tutorial", url: "https://www.youtube.com/watch?v=Z20nUd9IsCQ", platform: "YouTube", videoId: "Z20nUd9IsCQ" }
        ],
        pdfs: [{ title: "React Native Docs", url: "https://reactnative.dev/docs/getting-started" }],
        links: [
          { title: "Expo Platform", url: "https://expo.dev/" },
          { title: "React Native Directory", url: "https://reactnative.directory/" }
        ]
      }
    },
    {
      title: "Flutter & Dart Complete Course",
      instructor: "Maximilian Schwarzmüller",
      duration: "12 weeks",
      students: 4450,
      rating: 4.8,
      level: "Beginner",
      category: "Mobile Development",
      description: "Cross-platform mobile apps with Flutter, Dart, Firebase integration",
      resources: {
        videos: [
          { title: "Flutter Full Course", url: "https://www.youtube.com/watch?v=VPvVDiRtE7c", platform: "YouTube", videoId: "VPvVDiRtE7c" },
          { title: "Dart Programming Tutorial", url: "https://www.youtube.com/watch?v=5xlVP049Itw", platform: "YouTube", videoId: "5xlVP049Itw" }
        ],
        pdfs: [{ title: "Flutter Documentation", url: "https://docs.flutter.dev/" }],
        links: [
          { title: "Flutter Dev", url: "https://flutter.dev/" },
          { title: "Pub.dev Packages", url: "https://pub.dev/" }
        ]
      }
    },
    {
      title: "UI/UX Design with Figma",
      instructor: "Mizko",
      duration: "10 weeks",
      students: 5120,
      rating: 4.9,
      level: "Beginner",
      category: "Design",
      description: "User research, wireframing, prototyping, design systems in Figma",
      resources: {
        videos: [
          { title: "Figma UI/UX Design Tutorial", url: "https://www.youtube.com/watch?v=jwCmIBjm8NM", platform: "YouTube", videoId: "jwCmIBjm8NM" },
          { title: "UX Design Full Course", url: "https://www.youtube.com/watch?v=9B0mtpd0hXc", platform: "YouTube", videoId: "9B0mtpd0hXc" }
        ],
        pdfs: [{ title: "Laws of UX", url: "https://lawsofux.com/" }],
        links: [
          { title: "Figma Community", url: "https://www.figma.com/community" },
          { title: "Google UX Design Certificate", url: "https://grow.google/uxdesign/" }
        ]
      }
    },
    {
      title: "SQL & PostgreSQL Mastery",
      instructor: "Amigoscode",
      duration: "8 weeks",
      students: 5890,
      rating: 4.9,
      level: "Beginner",
      category: "Data Science",
      description: "SQL queries, joins, indexes, PostgreSQL, database design",
      resources: {
        videos: [
          { title: "SQL Full Course", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", platform: "YouTube", videoId: "HXV3zeQKqGY" },
          { title: "PostgreSQL Tutorial", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", platform: "YouTube", videoId: "qw--VYLpxG4" }
        ],
        pdfs: [{ title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" }],
        links: [
          { title: "SQLBolt Interactive", url: "https://sqlbolt.com/" },
          { title: "LeetCode Database", url: "https://leetcode.com/problemset/database/" }
        ]
      }
    },
    {
      title: "Java Spring Boot Microservices",
      instructor: "Amigoscode",
      duration: "14 weeks",
      students: 3670,
      rating: 4.8,
      level: "Intermediate",
      category: "Programming",
      description: "Spring Boot, REST APIs, JPA, microservices, Docker deployment",
      resources: {
        videos: [
          { title: "Spring Boot Full Course", url: "https://www.youtube.com/watch?v=9SGDpanrc8U", platform: "YouTube", videoId: "9SGDpanrc8U" },
          { title: "Java Full Course", url: "https://www.youtube.com/watch?v=eIrMbAQSU34", platform: "YouTube", videoId: "eIrMbAQSU34" }
        ],
        pdfs: [{ title: "Spring Boot Reference", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/" }],
        links: [
          { title: "Spring Initializr", url: "https://start.spring.io/" },
          { title: "Baeldung Tutorials", url: "https://www.baeldung.com/" }
        ]
      }
    },
    {
      title: "AWS Solutions Architect Certification Prep",
      instructor: "Stephane Maarek",
      duration: "10 weeks",
      students: 4230,
      rating: 4.9,
      level: "Intermediate",
      category: "Cloud & DevOps",
      description: "EC2, S3, RDS, Lambda, VPC — pass the AWS SAA-C03 exam",
      resources: {
        videos: [
          { title: "AWS Solutions Architect Course", url: "https://www.youtube.com/watch?v=Ia-UEzM3DuI", platform: "YouTube", videoId: "Ia-UEzM3DuI" },
          { title: "AWS Lambda Tutorial", url: "https://www.youtube.com/watch?v=eOBq__bYWQo", platform: "YouTube", videoId: "eOBq__bYWQo" }
        ],
        pdfs: [{ title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" }],
        links: [
          { title: "AWS Skill Builder", url: "https://skillbuilder.aws/" },
          { title: "AWS Free Tier", url: "https://aws.amazon.com/free/" }
        ]
      }
    },
    {
      title: "Competitive Programming Bootcamp",
      instructor: "William Lin",
      duration: "20 weeks",
      students: 2890,
      rating: 4.9,
      level: "Advanced",
      category: "Programming",
      description: "Codeforces, AtCoder, ICPC prep — advanced algorithms & math",
      resources: {
        videos: [
          { title: "Competitive Programming Course", url: "https://www.youtube.com/watch?v=8hly31xKli0", platform: "YouTube", videoId: "8hly31xKli0" },
          { title: "Number Theory for CP", url: "https://www.youtube.com/watch?v=ugFnF67t6PI", platform: "YouTube", videoId: "ugFnF67t6PI" }
        ],
        pdfs: [{ title: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" }],
        links: [
          { title: "Codeforces", url: "https://codeforces.com/" },
          { title: "CSES Problem Set", url: "https://cses.fi/problemset/" }
        ]
      }
    },
    {
      title: "Digital Marketing & SEO Fundamentals",
      instructor: "Neil Patel",
      duration: "8 weeks",
      students: 3560,
      rating: 4.7,
      level: "Beginner",
      category: "Business",
      description: "SEO, Google Analytics, social media marketing, content strategy",
      resources: {
        videos: [
          { title: "Digital Marketing Full Course", url: "https://www.youtube.com/watch?v=ZVuToMilP0A", platform: "YouTube", videoId: "ZVuToMilP0A" },
          { title: "SEO Tutorial for Beginners", url: "https://www.youtube.com/watch?v=xsVTqzratPs", platform: "YouTube", videoId: "xsVTqzratPs" }
        ],
        pdfs: [{ title: "Google SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" }],
        links: [
          { title: "Google Search Console", url: "https://search.google.com/search-console" },
          { title: "Moz SEO Learning", url: "https://moz.com/learn/seo" }
        ]
      }
    }
  ];

  // Competitive Exams
  const competitiveExams = [
    {
      name: "GATE (Graduate Aptitude Test)",
      category: "Engineering",
      subjects: ["CS", "EC", "EE", "ME", "CE"],
      duration: "6 months prep",
      icon: GraduationCap,
      resources: {
        videos: [
          { title: "GATE CSE Foundations - NPTEL IIT", url: "https://nptel.ac.in/courses/106105152", platform: "NPTEL" },
          { title: "GATE Digital Logic Design - NPTEL", url: "https://nptel.ac.in/courses/106105232", platform: "NPTEL" },
          { title: "GATE Data Structures - NPTEL IIT Madras", url: "https://nptel.ac.in/courses/106105162", platform: "NPTEL" },
          { title: "GATE Algorithms - NPTEL IIT Kharagpur", url: "https://nptel.ac.in/courses/106105033", platform: "NPTEL" },
          { title: "GATE Mathematics - IIT Bombay", url: "https://nptel.ac.in/courses/111108133", platform: "NPTEL" },
          { title: "GATE OS & DBMS Complete", url: "https://www.youtube.com/watch?v=GH-QY0cYhf0", platform: "YouTube", videoId: "GH-QY0cYhf0" }
        ],
        pdfs: [
          { title: "GATE Previous Papers (10 Years)", url: "https://gate.iitbombay.ac.in/previous-question-papers" },
          { title: "NPTEL GATE Study Materials", url: "https://nptel.ac.in/courses" },
          { title: "Data Structures & Algorithms Notes", url: "https://www.geeksforgeeks.org/gate-cs-notes/" },
          { title: "Digital Logic Design Complete", url: "https://en.wikibooks.org/wiki/Digital_Circuits" }
        ],
        links: [
          { title: "NPTEL GATE Portal", url: "https://nptel.ac.in" },
          { title: "IIT GATE Official", url: "https://gate.iitbombay.ac.in/" },
          { title: "GeeksforGeeks GATE", url: "https://www.geeksforgeeks.org/gate/" },
          { title: "GATE CSE Curriculum", url: "https://gate.iitbombay.ac.in/gate-exam-details/syllabus" }
        ]
      }
    },
    {
      name: "GRE (Graduate Record Examination)",
      category: "International",
      subjects: ["Verbal", "Quant", "Analytical Writing"],
      duration: "4 months prep",
      icon: Award,
      resources: {
        videos: [
          { title: "GRE Full Course - 40 Hours", url: "https://www.youtube.com/watch?v=J6Y8gHmMXZQ", platform: "YouTube", videoId: "J6Y8gHmMXZQ" },
          { title: "GRE Quantitative Reasoning", url: "https://www.youtube.com/watch?v=c3XsfwlhkI4", platform: "YouTube", videoId: "c3XsfwlhkI4" },
          { title: "GRE Verbal Reasoning", url: "https://www.youtube.com/watch?v=TtMD01-PuBs", platform: "YouTube", videoId: "TtMD01-PuBs" },
          { title: "GRE AWA Writing Guide", url: "https://www.youtube.com/watch?v=CxJeK9tQ0Ks", platform: "YouTube", videoId: "CxJeK9tQ0Ks" }
        ],
        pdfs: [
          { title: "Official GRE Guide (Free)", url: "https://www.ets.org/gre" },
          { title: "GRE Vocabulary List", url: "https://www.vocabularysize.com/gre" },
          { title: "GRE Math Practice Book", url: "https://www.ets.org/gre/free" }
        ],
        links: [
          { title: "ETS Official GRE Site", url: "https://www.ets.org/gre" },
          { title: "Khan Academy GRE Prep", url: "https://www.khanacademy.org/test-prep/gre" },
          { title: "Magoosh GRE Free Resources", url: "https://gre.magoosh.com/lessons" }
        ]
      }
    },
    {
      name: "TOEFL/IELTS",
      category: "International",
      subjects: ["Reading", "Writing", "Listening", "Speaking"],
      duration: "3 months prep",
      icon: FileText,
      resources: {
        videos: [
          { title: "IELTS Full Course - 20 Hours", url: "https://www.youtube.com/watch?v=DdKAG5xYrB4", platform: "YouTube", videoId: "DdKAG5xYrB4" },
          { title: "TOEFL IBT Complete Guide", url: "https://www.youtube.com/watch?v=4jjxzXJpKHc", platform: "YouTube", videoId: "4jjxzXJpKHc" },
          { title: "IELTS Speaking Tips", url: "https://www.youtube.com/watch?v=LFQZ1kp9_3A", platform: "YouTube", videoId: "LFQZ1kp9_3A" },
          { title: "TOEFL Writing Tasks", url: "https://www.youtube.com/watch?v=S7fFfPYGNZc", platform: "YouTube", videoId: "S7fFfPYGNZc" }
        ],
        pdfs: [
          { title: "IELTS Official Practice Tests", url: "https://www.ielts.org/" },
          { title: "TOEFL Practice Book", url: "https://www.ets.org/toefl" },
          { title: "Academic Vocabulary List", url: "https://academic.englishforums.com/vocabulary" }
        ],
        links: [
          { title: "IELTS Official Portal", url: "https://www.ielts.org/" },
          { title: "TOEFL Home Edition", url: "https://www.ets.org/toefl/test-takers/ibt/about/what-is" },
          { title: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish/" }
        ]
      }
    },
    {
      name: "UPSC (Civil Services)",
      category: "Government",
      subjects: ["Prelims", "Mains", "Interview"],
      duration: "12 months prep",
      icon: Trophy,
      resources: {
        videos: [
          { title: "UPSC IAS Complete Course", url: "https://www.youtube.com/watch?v=I9oKGEWNF7E", platform: "YouTube", videoId: "I9oKGEWNF7E" },
          { title: "UPSC Polity by Laxmikanth", url: "https://www.youtube.com/watch?v=h0T0VB3yBz4", platform: "YouTube", videoId: "h0T0VB3yBz4" },
          { title: "UPSC History NCERT Insights", url: "https://www.youtube.com/watch?v=uQqh4bDdVcc", platform: "YouTube", videoId: "uQqh4bDdVcc" },
          { title: "UPSC Geography for IAS", url: "https://www.youtube.com/watch?v=OwKvb0jMDY4", platform: "YouTube", videoId: "OwKvb0jMDY4" },
          { title: "UPSC Essay & Answer Writing", url: "https://www.youtube.com/watch?v=vRcgp4W-PFc", platform: "YouTube", videoId: "vRcgp4W-PFc" }
        ],
        pdfs: [
          { title: "NCERT Books 6-12 (Free)", url: "https://ncert.nic.in/" },
          { title: "UPSC Prelims Papers (20 Years)", url: "https://www.upsc.gov.in/" },
          { title: "Indian Polity - M Laxmikanth", url: "https://www.upsc.gov.in/examination/civil-service-examination-cse" }
        ],
        links: [
          { title: "UPSC Official Portal", url: "https://www.upsc.gov.in/" },
          { title: "NCERT Official Site", url: "https://ncert.nic.in/" },
          { title: "Civil Services Syllabus", url: "https://www.upsc.gov.in/examination/civil-service-examination-cse" }
        ]
      }
    },
    {
      name: "SSC CGL/CHSL",
      category: "Government",
      subjects: ["Reasoning", "Quant", "English", "GK"],
      duration: "6 months prep",
      icon: FileText,
      resources: {
        videos: [
          { title: "SSC CGL Full Course - 100 Hours", url: "https://www.youtube.com/watch?v=M5lxTmf9BvU", platform: "YouTube", videoId: "M5lxTmf9BvU" },
          { title: "SSC Quantitative Aptitude", url: "https://www.youtube.com/watch?v=8wfE7GYY5UM", platform: "YouTube", videoId: "8wfE7GYY5UM" },
          { title: "SSC English Grammar Complete", url: "https://www.youtube.com/watch?v=ycnSVRBk5EM", platform: "YouTube", videoId: "ycnSVRBk5EM" },
          { title: "SSC Reasoning Tricks", url: "https://www.youtube.com/watch?v=8Cv-Dy47zcg", platform: "YouTube", videoId: "8Cv-Dy47zcg" }
        ],
        pdfs: [
          { title: "SSC Previous Papers (10 Years)", url: "https://ssc.nic.in/" },
          { title: "Quantitative Aptitude Shortcuts", url: "https://www.sscadda.com/" },
          { title: "English for SSC - Complete Guide", url: "https://www.studysmarter.co.uk/" }
        ],
        links: [
          { title: "SSC Official Portal", url: "https://ssc.nic.in/" },
          { title: "SSC Adda - Study Materials", url: "https://www.sscadda.com/" },
          { title: "Testbook SSC Prep", url: "https://testbook.com/ssc" }
        ]
      }
    },
    {
      name: "Banking Exams (IBPS/SBI)",
      category: "Government",
      subjects: ["Reasoning", "Quant", "English", "Banking Awareness"],
      duration: "5 months prep",
      icon: Award,
      resources: {
        videos: [
          { title: "SBI PO Complete Course", url: "https://www.youtube.com/watch?v=DWRxL5r7fFo", platform: "YouTube", videoId: "DWRxL5r7fFo" },
          { title: "IBPS RRB Prep - 50 Hours", url: "https://www.youtube.com/watch?v=9pGXLBxYaWE", platform: "YouTube", videoId: "9pGXLBxYaWE" },
          { title: "Banking Awareness 2024", url: "https://www.youtube.com/watch?v=3Jm8bH3k1p8", platform: "YouTube", videoId: "3Jm8bH3k1p8" },
          { title: "Banking Quantitative Aptitude", url: "https://www.youtube.com/watch?v=8Cv-Dy47zcg", platform: "YouTube", videoId: "8Cv-Dy47zcg" }
        ],
        pdfs: [
          { title: "SBI/IBPS Previous Papers", url: "https://www.ibps.in/" },
          { title: "Banking Awareness PDF", url: "https://www.sscadda.com/bank-awareness" },
          { title: "Current Affairs Monthly", url: "https://www.edudose.com/" }
        ],
        links: [
          { title: "IBPS Official Portal", url: "https://www.ibps.in/" },
          { title: "SBI Official Site", url: "https://www.sbi.co.in/" },
          { title: "Banking & Finance News", url: "https://economictimes.indiatimes.com/markets" }
        ]
      }
    },
    {
      name: "CAT/XAT/GMAT",
      category: "Management",
      subjects: ["Quant", "Verbal", "DILR"],
      duration: "8 months prep",
      icon: GraduationCap,
      resources: {
        videos: [
          { title: "CAT Complete Course - 80 Hours", url: "https://www.youtube.com/watch?v=gqmhJ5BvjV0", platform: "YouTube", videoId: "gqmhJ5BvjV0" },
          { title: "CAT DILR Masterclass", url: "https://www.youtube.com/watch?v=5-Qs_5k8kok", platform: "YouTube", videoId: "5-Qs_5k8kok" },
          { title: "CAT Verbal Ability & RC", url: "https://www.youtube.com/watch?v=pLGaJ7h5m_4", platform: "YouTube", videoId: "pLGaJ7h5m_4" },
          { title: "GMAT Quantitative Reasoning", url: "https://www.youtube.com/watch?v=ZZxPx1A9wjk", platform: "YouTube", videoId: "ZZxPx1A9wjk" }
        ],
        pdfs: [
          { title: "CAT Previous Papers (20 Years)", url: "https://www.iimcat.ac.in/" },
          { title: "GMAT Official Guide", url: "https://www.mba.com/" },
          { title: "XAT Preparation Books", url: "https://www.xlri.ac.in/" }
        ],
        links: [
          { title: "IIM CAT Portal", url: "https://www.iimcat.ac.in/" },
          { title: "GMAT Official", url: "https://www.mba.com/" },
          { title: "XAT Official", url: "https://www.xlri.ac.in/" },
          { title: "MBA Entrance Exams", url: "https://www.testfunda.com/" }
        ]
      }
    },
    {
      name: "Coding Interviews (FAANG)",
      category: "Private Sector",
      subjects: ["DSA", "System Design", "Problem Solving"],
      duration: "6 months prep",
      icon: Trophy,
      resources: {
        videos: [
          { title: "DSA & Coding Interview - 200 Hours", url: "https://www.youtube.com/watch?v=WO4sEKrKWec", platform: "YouTube", videoId: "WO4sEKrKWec" },
          { title: "System Design Masterclass", url: "https://www.youtube.com/watch?v=UzLMhqg3XX0", platform: "YouTube", videoId: "UzLMhqg3XX0" },
          { title: "NPTEL Data Structures - IIT Delhi", url: "https://nptel.ac.in/courses/106104166", platform: "NPTEL" },
          { title: "Algorithms - NPTEL IIT Bombay", url: "https://nptel.ac.in/courses/106104001", platform: "NPTEL" }
        ],
        pdfs: [
          { title: "Cracking Coding Interview Book", url: "https://www.crackingthecodinginterview.com/" },
          { title: "LeetCode DSA Problems", url: "https://leetcode.com/explore/" },
          { title: "System Design Interview Guide", url: "https://github.com/donnemartin/system-design-primer" }
        ],
        links: [
          { title: "LeetCode Platform", url: "https://leetcode.com/" },
          { title: "HackerRank Coding", url: "https://www.hackerrank.com/" },
          { title: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
          { title: "AlgoExpert", url: "https://www.algoexpert.io/" }
        ]
      }
    },
    {
      name: "AWS/Azure/GCP Certifications",
      category: "IT Certifications",
      subjects: ["Cloud Architecture", "DevOps", "Security"],
      duration: "3 months prep",
      icon: Award,
      resources: {
        videos: [
          { title: "AWS Solutions Architect - 20 Hours", url: "https://www.youtube.com/watch?v=ZccRLXICtG0", platform: "YouTube", videoId: "ZccRLXICtG0" },
          { title: "Azure Administrator - 25 Hours", url: "https://www.youtube.com/watch?v=4PmAIbNrHKI", platform: "YouTube", videoId: "4PmAIbNrHKI" },
          { title: "GCP Associate Cloud Engineer", url: "https://www.youtube.com/watch?v=jpno8FSqpc8", platform: "YouTube", videoId: "jpno8FSqpc8" },
          { title: "Kubernetes Complete Course", url: "https://www.youtube.com/watch?v=d6WC5n9G_sM", platform: "YouTube", videoId: "d6WC5n9G_sM" }
        ],
        pdfs: [
          { title: "AWS Certified Solutions Architect Guide", url: "https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf" },
          { title: "Azure Learning Path", url: "https://learn.microsoft.com/en-us/azure/" },
          { title: "Kubernetes Official Docs", url: "https://kubernetes.io/docs/" }
        ],
        links: [
          { title: "AWS Training", url: "https://aws.amazon.com/training/" },
          { title: "Azure Learn", url: "https://learn.microsoft.com/en-us/azure/" },
          { title: "Google Cloud Training", url: "https://cloud.google.com/training" },
          { title: "Linux Academy", url: "https://www.pluralsight.com/" }
        ]
      }
    },
    {
      name: "Online Coding Contests",
      category: "Competitive Programming",
      subjects: ["Codeforces", "LeetCode", "HackerRank"],
      duration: "Ongoing",
      icon: Trophy,
      resources: {
        videos: [
          { title: "Competitive Programming - NPTEL IIT BHU", url: "https://nptel.ac.in/courses/106104015", platform: "NPTEL" },
          { title: "CP Full Course 100 Hours", url: "https://www.youtube.com/watch?v=8hly31xrwQE", platform: "YouTube", videoId: "8hly31xrwQE" },
          { title: "Graph Algorithms Masterclass", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU", platform: "YouTube", videoId: "tWVWeAqZ0WU" },
          { title: "Dynamic Programming Complete", url: "https://www.youtube.com/watch?v=aPQY3dAyzS0", platform: "YouTube", videoId: "aPQY3dAyzS0" }
        ],
        pdfs: [
          { title: "Competitive Programming Book", url: "https://cpbook.net/" },
          { title: "ICPC Problem Database", url: "https://codeforces.com/problemsets/acmsgru" },
          { title: "Algorithm Notes Collection", url: "https://github.com/Ashishgup/Competitive-Programming" }
        ],
        links: [
          { title: "Codeforces Contests", url: "https://codeforces.com/" },
          { title: "AtCoder Contests", url: "https://atcoder.jp/" },
          { title: "HackerRank Challenges", url: "https://www.hackerrank.com/challenges" },
          { title: "SPOJ Problem Archive", url: "https://www.spoj.com/" },
          { title: "Competitive Programming Guide", url: "https://github.com/topics/competitive-programming" }
        ]
      }
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

  const handleWatchVideo = (video: any) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  if (showDashboard) {
    return (
      <PageLayout>
        <CourseDashboard enrolledCourses={enrolledCourses} onBack={() => setShowDashboard(false)} embedded />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
          
          {/* Header Section */}
          <div className="mb-10 animate-reveal-up">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div>
                <div className="badge-gradient inline-flex mb-4">
                  <BookOpen className="w-3 h-3" />
                  Learning Paths
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Explore Courses
                </h1>
                <p className="text-muted-foreground">
                  Expert-curated courses with free resources from top educators worldwide
                </p>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button onClick={() => navigate('/ai-tools')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-white/3 transition-all duration-200">
                  <Wrench className="w-3.5 h-3.5" />
                  AI Tools
                </button>
                <button onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                  <BookOpen className="w-3.5 h-3.5" />
                  My Dashboard
                </button>
              </div>
            </div>
            <div className="relative w-full max-w-lg mt-7">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
              <input type="text" placeholder="Search courses, instructors..."
                className="premium-input pl-11" />
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border/30 p-5 animate-pulse bg-card">
                  <div className="h-4 w-20 bg-border/40 rounded-lg mb-3" />
                  <div className="h-5 w-3/4 bg-border/40 rounded-lg mb-2" />
                  <div className="h-3 w-1/2 bg-border/30 rounded mb-3" />
                  <div className="h-3 w-full bg-border/25 rounded mb-5" />
                  <div className="h-9 bg-primary/15 rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
              <p>No courses available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, index) => {
              return (
                <div
                  key={course._id || index}
                  className="group relative rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 card-lift bg-card shadow-sm transition-all duration-300 animate-reveal-up"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 p-5">
                    {/* Category & Level */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/15 text-primary">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 rounded-lg bg-border/30">
                        {course.level}
                      </span>
                    </div>

                    {/* Title & Instructor */}
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug"
                      style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem' }}>
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2.5">{course.instructor}</p>
                    <p className="text-xs text-muted-foreground/80 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-5 pb-4 border-b border-border/30">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.students || course.enrollmentCount || 0).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-foreground">{course.rating}</span></span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => handleEnroll(course)}
                        className="relative flex-1 py-2.5 rounded-xl text-xs font-semibold text-white overflow-hidden group/btn transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        <span className="relative z-10">Enroll Now</span>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                      </button>
                      {course.resources && (
                        <button onClick={() => handleViewResources(course)}
                          className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                          title="View Free Resources">
                          <BookOpen className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}

          {/* Competitive Exams Section */}
          <div className="mt-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent mb-14" />
            <div className="mb-8">
              <div className="badge-gradient inline-flex mb-4">
                <Trophy className="w-3 h-3" />
                Competitive Exams
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                Crack Your Dream Exam
              </h2>
              <p className="text-muted-foreground">
                Prepare for GATE, GRE, UPSC and more with expert resources
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {competitiveExams.map((exam, index) => {
                const Icon = exam.icon;
                return (
                  <div key={index}
                    className="group relative rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 card-lift bg-card shadow-sm transition-all duration-300 animate-reveal-up"
                    style={{ animationDelay: `${index * 0.04}s` }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)' }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors truncate"
                            style={{ fontFamily: 'Sora, sans-serif' }}>
                            {exam.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-primary/8 border border-primary/15 text-primary">{exam.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{exam.duration}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exam.subjects.slice(0, 3).map((s: string, j: number) => (
                          <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-md bg-border/40 text-muted-foreground">{s}</span>
                        ))}
                        {exam.subjects.length > 3 && <span className="text-[10px] text-muted-foreground/60">+{exam.subjects.length - 3}</span>}
                      </div>
                      <button onClick={() => handleViewResources(exam)}
                        className="relative w-full py-2.5 rounded-xl text-xs font-semibold text-white overflow-hidden group/btn transition-all hover:shadow-[0_0_12px_rgba(124,58,237,0.25)]"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
                        <span className="relative z-10">Start Now</span>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl" style={{ background: 'hsl(230,25%,7%)', border: '1px solid hsl(230,20%,14%)' }}>
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>Enrolled Successfully!</h2>
                <p className="text-sm text-muted-foreground mt-1">You now have full access to course materials</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <button onClick={handleViewDashboard}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              <Play className="w-4 h-4" /> Go to Dashboard
            </button>
            <button onClick={() => setShowSuccessDialog(false)}
              className="w-full py-3 rounded-xl text-sm font-medium text-muted-foreground border border-border/50 hover:text-foreground hover:border-border transition-all">
              Continue Browsing
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Free Resources Dialog - Clean Design */}
      <Dialog open={showResourcesDialog} onOpenChange={setShowResourcesDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-5 h-5 text-primary" />
              Free Learning Resources
            </DialogTitle>
            {selectedCourse && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCourse.title || selectedCourse.name}
              </p>
            )}
          </DialogHeader>
          
          {selectedCourse?.resources && (
            <div className="space-y-6 py-4">
              {/* Video Lectures */}
              {selectedCourse.resources.videos && selectedCourse.resources.videos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Video Lectures</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.videos.map((video: any, idx: number) => {
                      const completed = video.videoId ? isVideoCompleted(video.videoId) : false;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-all group ${completed ? 'bg-primary/5 border-primary/20' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${completed ? 'bg-primary/10' : 'bg-muted/50'}`}>
                              {completed ? (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              ) : (
                                <Play className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm flex items-center gap-2">
                                {video.title}
                                {completed && <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Completed</Badge>}
                              </p>
                              <p className="text-xs text-muted-foreground">{video.platform}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {video.videoId && (
                              <Button
                                onClick={() => handleWatchVideo(video)}
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <Monitor className="w-3 h-3 mr-1" />
                                {completed ? 'Rewatch' : 'Watch'}
                              </Button>
                            )}
                            <Button
                              onClick={() => window.open(video.url, '_blank')}
                              size="sm"
                              variant="outline"
                              className="border-border/50"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PDF Resources */}
              {selectedCourse.resources.pdfs && selectedCourse.resources.pdfs.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">PDF Books & Guides</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.pdfs.map((pdf: any, idx: number) => (
                      <a
                        key={idx}
                        href={pdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{pdf.title}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Useful Links */}
              {selectedCourse.resources.links && selectedCourse.resources.links.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Documentation & Resources</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.links.map((link: any, idx: number) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                            <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{link.title}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Banner */}
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-sm text-center text-muted-foreground">
                  All resources are free and from legitimate sources
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => setShowResourcesDialog(false)}
              className="border-border/50"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleEnroll(selectedCourse);
                setShowResourcesDialog(false);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enroll in Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal with Tracking */}
      {selectedVideo && selectedCourse && (
        <VideoPlayerWithTracking
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
          videoTitle={selectedVideo.title}
          videoId={selectedVideo.videoId}
          platform={selectedVideo.platform}
          originalUrl={selectedVideo.url}
          courseTitle={selectedCourse.title || selectedCourse.name}
        />
      )}

      {/* Certificate Modal */}
      {selectedCourse && (
        <CourseCertificate
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          courseTitle={selectedCourse.title || selectedCourse.name}
          studentName="Student" 
          completionDate={new Date().toISOString()}
          courseInstructor={selectedCourse.instructor}
          courseDuration={selectedCourse.duration}
        />
      )}
      
    </PageLayout>
  );
};

export default Courses;