import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Clock, Users, Star, CheckCircle, Play, Wrench, Award, GraduationCap, FileText, Trophy, Video, Download, ExternalLink, Monitor } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseDashboard from "../components/CourseDashboard";
import VideoPlayerWithTracking from "../components/VideoPlayerWithTracking";
import CourseCertificate from "../components/CourseCertificate";
import { useCourseContext } from "../contexts/CourseContext";
import { useVideoProgress } from "../contexts/VideoProgressContext";

const Courses = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const { enrolledCourses, addCourse } = useCourseContext();
  const { isCourseCompleted, getCompletedVideos, isVideoCompleted } = useVideoProgress();
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
                        onClick={() => handleViewResources(exam)}
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
                    <Badge variant="secondary" className="text-xs">Watch on our site! 🎥</Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedCourse.resources.videos.map((video: any, idx: number) => {
                      const completed = video.videoId ? isVideoCompleted(video.videoId) : false;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:border-primary transition-all group ${completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${completed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                              {completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
                              ) : (
                                <Play className="w-4 h-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium flex items-center gap-2">
                                {video.title}
                                {completed && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">✓ Completed</Badge>}
                              </p>
                              <p className="text-xs text-muted-foreground">{video.platform}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {video.videoId && (
                              <Button
                                onClick={() => handleWatchVideo(video)}
                                size="sm"
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
                              >
                                <Monitor className="w-3 h-3 mr-1" />
                                {completed ? 'Rewatch' : 'Watch Here'}
                              </Button>
                            )}
                            <Button
                              onClick={() => window.open(video.url, '_blank')}
                              size="sm"
                              variant="outline"
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

      {/* Video Player Modal with Tracking */}
      {selectedVideo && selectedCourse && (
        <VideoPlayerWithTracking
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
          videoTitle={selectedVideo.title}
          videoId={selectedVideo.videoId}
          platform={selectedVideo.platform}
          originalUrl={selectedVideo.url}
          courseTitle={selectedCourse.title}
        />
      )}

      {/* Certificate Modal */}
      {selectedCourse && (
        <CourseCertificate
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          courseTitle={selectedCourse.title}
          studentName="Student" 
          completionDate={new Date().toISOString()}
          courseInstructor={selectedCourse.instructor}
          courseDuration={selectedCourse.duration}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Courses;
