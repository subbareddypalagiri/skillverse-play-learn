import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

// Models
import User from '../models/User.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedMassiveData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB for Massive Seed');

    // Clear courses and events for clean re-seed
    await Course.deleteMany({});
    await Event.deleteMany({});
    logger.info('🗑️  Cleared existing Courses and Events for fresh insert');

    // Ensure we have an admin and instructor
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@skillverse.com",
        password: "Password123!",
        role: "admin",
        bio: "SkillVerse Platform Administrator"
      });
    }

    let instructorUser = await User.findOne({ role: 'instructor' });
    if (!instructorUser) {
      instructorUser = await User.create({
        name: "Mike Instructor",
        email: "mike@skillverse.com",
        password: "Password123!",
        role: "instructor",
        bio: "Expert Full Stack Instructor"
      });
    }

    // =====================================================
    // ALL 30 COURSES WITH FULL MEDIA RESOURCES
    // =====================================================
    const coursesToSeed = [
      // 1. Full Stack Web Development Bootcamp
      {
        title: "Full Stack Web Development Bootcamp",
        instructor: "Angela Yu",
        category: "Web Development",
        level: "Beginner",
        duration: "16 weeks",
        description: "Complete MERN Stack - HTML, CSS, JavaScript, React, Node.js, MongoDB",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 6789,
        rating: 4.9,
        ratingCount: 1250,
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

      // 2. Cloud Computing Fundamentals
      {
        title: "Cloud Computing Fundamentals",
        instructor: "Dr. Rajesh Kumar",
        category: "Cloud & DevOps",
        level: "Beginner",
        duration: "12 weeks",
        description: "Master AWS, Azure, and GCP fundamentals",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3245,
        rating: 4.9,
        ratingCount: 870,
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

      // 3. DevOps Engineering Complete Guide
      {
        title: "DevOps Engineering Complete Guide",
        instructor: "Sarah Mitchell",
        category: "Cloud & DevOps",
        level: "Intermediate",
        duration: "14 weeks",
        description: "CI/CD, Docker, Kubernetes, Jenkins",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2890,
        rating: 4.8,
        ratingCount: 720,
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

      // 4. Artificial Intelligence Masterclass
      {
        title: "Artificial Intelligence Masterclass",
        instructor: "Prof. Andrew Chen",
        category: "AI & ML",
        level: "Intermediate",
        duration: "16 weeks",
        description: "Complete AI from basics to advanced",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 4567,
        rating: 4.9,
        ratingCount: 1100,
        resources: {
          videos: [
            { title: "AI Full Course - Stanford", url: "https://www.youtube.com/watch?v=J8Eh7RqggsU", platform: "YouTube", videoId: "J8Eh7RqggsU" },
            { title: "Machine Learning Lecture by Andrew Ng", url: "https://www.youtube.com/watch?v=UzxYlbK2c7E", platform: "YouTube", videoId: "UzxYlbK2c7E" },
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

      // 5. Deep Learning & Neural Networks
      {
        title: "Deep Learning & Neural Networks",
        instructor: "Dr. Emily Watson",
        category: "AI & ML",
        level: "Advanced",
        duration: "18 weeks",
        description: "TensorFlow, PyTorch, CNNs, RNNs, GANs",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3421,
        rating: 4.9,
        ratingCount: 980,
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

      // 6. Big Data Analytics & Processing
      {
        title: "Big Data Analytics & Processing",
        instructor: "Michael Zhang",
        category: "Data Science",
        level: "Intermediate",
        duration: "14 weeks",
        description: "Hadoop, Spark, Data Warehousing",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2678,
        rating: 4.7,
        ratingCount: 650,
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

      // 7. Blockchain Technology & Development
      {
        title: "Blockchain Technology & Development",
        instructor: "Alex Thompson",
        category: "Blockchain",
        level: "Intermediate",
        duration: "12 weeks",
        description: "Smart Contracts, DApps, Web3",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2134,
        rating: 4.8,
        ratingCount: 540,
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

      // 8. Internet of Things (IoT) Complete
      {
        title: "Internet of Things (IoT) Complete",
        instructor: "Dr. Priya Sharma",
        category: "IoT",
        level: "Beginner",
        duration: "10 weeks",
        description: "Arduino, Raspberry Pi, IoT Protocols",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 1890,
        rating: 4.7,
        ratingCount: 430,
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

      // 9. AR/VR Development Fundamentals
      {
        title: "AR/VR Development Fundamentals",
        instructor: "James Wilson",
        category: "AR/VR",
        level: "Intermediate",
        duration: "12 weeks",
        description: "Unity, Unreal Engine, Meta Quest",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 1567,
        rating: 4.8,
        ratingCount: 390,
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

      // 10. Python Programming Complete Course
      {
        title: "Python Programming Complete Course",
        instructor: "Dr. Lisa Anderson",
        category: "Programming",
        level: "Beginner",
        duration: "10 weeks",
        description: "From basics to advanced Python",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 5234,
        rating: 4.9,
        ratingCount: 1400,
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

      // 11. Advanced Python for Data Science
      {
        title: "Advanced Python for Data Science",
        instructor: "Robert Kim",
        category: "Programming",
        level: "Advanced",
        duration: "12 weeks",
        description: "NumPy, Pandas, Matplotlib, Scikit-learn",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3456,
        rating: 4.8,
        ratingCount: 910,
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

      // 12. Cybersecurity Fundamentals
      {
        title: "Cybersecurity Fundamentals",
        instructor: "Col. David Miller",
        category: "Cybersecurity",
        level: "Beginner",
        duration: "14 weeks",
        description: "Network Security, Cryptography, Security+",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3890,
        rating: 4.9,
        ratingCount: 1050,
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

      // 13. Ethical Hacking & Penetration Testing
      {
        title: "Ethical Hacking & Penetration Testing",
        instructor: "Kevin Roberts",
        category: "Cybersecurity",
        level: "Advanced",
        duration: "16 weeks",
        description: "CEH, OSCP, Bug Bounty Hunting",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2987,
        rating: 4.9,
        ratingCount: 840,
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

      // 14. Blockchain Security & Auditing
      {
        title: "Blockchain Security & Auditing",
        instructor: "Dr. Maria Garcia",
        category: "Blockchain",
        level: "Advanced",
        duration: "10 weeks",
        description: "Smart Contract Security, DeFi Audits",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 1456,
        rating: 4.7,
        ratingCount: 360,
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

      // 15. Quantum Computing Fundamentals
      {
        title: "Quantum Computing Fundamentals",
        instructor: "Prof. Richard Feynman Jr.",
        category: "Quantum Tech",
        level: "Advanced",
        duration: "12 weeks",
        description: "Qubits, Quantum Algorithms, IBM Qiskit",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 987,
        rating: 4.8,
        ratingCount: 280,
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

      // 16. Advanced Cyber Defense & Forensics
      {
        title: "Advanced Cyber Defense & Forensics",
        instructor: "Agent Sarah Connor",
        category: "Cybersecurity",
        level: "Advanced",
        duration: "18 weeks",
        description: "Incident Response, Malware Analysis, DFIR",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2345,
        rating: 4.9,
        ratingCount: 670,
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

      // 17. Generative AI & Large Language Models
      {
        title: "Generative AI & Large Language Models",
        instructor: "Dr. Sam Altman",
        category: "AI & ML",
        level: "Intermediate",
        duration: "14 weeks",
        description: "GPT, DALL-E, Stable Diffusion, Prompt Engineering",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 4890,
        rating: 4.9,
        ratingCount: 1350,
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

      // 18. AI Agents & Automation
      {
        title: "AI Agents & Automation",
        instructor: "Marcus Johnson",
        category: "AI & ML",
        level: "Advanced",
        duration: "12 weeks",
        description: "LangChain, AutoGPT, AI Workflows",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3234,
        rating: 4.8,
        ratingCount: 790,
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

      // 19. Data Structures & Algorithms Masterclass
      {
        title: "Data Structures & Algorithms Masterclass",
        instructor: "NeetCode",
        category: "Programming",
        level: "Intermediate",
        duration: "16 weeks",
        description: "Arrays, Trees, Graphs, DP — crack FAANG interviews",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 8920,
        rating: 4.9,
        ratingCount: 2100,
        resources: {
          videos: [
            { title: "DSA Full Course - freeCodeCamp", url: "https://www.youtube.com/watch?v=8hly31xKli0", platform: "YouTube", videoId: "8hly31xKli0" },
            { title: "NeetCode DSA Roadmap", url: "https://www.youtube.com/watch?v=otvLdDbzP5Y", platform: "YouTube", videoId: "otvLdDbzP5Y" },
            { title: "Graph Algorithms Explained", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", platform: "YouTube", videoId: "09_LlHjoEiY" },
            { title: "Dynamic Programming Patterns", url: "https://www.youtube.com/watch?v=aPQY__2H3tE", platform: "YouTube", videoId: "aPQY__2H3tE" }
          ],
          pdfs: [
            { title: "CLRS Introduction to Algorithms", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
            { title: "Grokking Algorithms (Free Chapters)", url: "https://www.manning.com/books/grokking-algorithms" },
            { title: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" }
          ],
          links: [
            { title: "LeetCode", url: "https://leetcode.com/" },
            { title: "NeetCode.io", url: "https://neetcode.io/" },
            { title: "AlgoExpert", url: "https://www.algoexpert.io/" },
            { title: "Codeforces", url: "https://codeforces.com/" }
          ]
        }
      },

      // 20. System Design for Software Engineers
      {
        title: "System Design for Software Engineers",
        instructor: "Gaurav Sen",
        category: "Web Development",
        level: "Advanced",
        duration: "10 weeks",
        description: "Scalability, microservices, load balancing, caching, databases at scale",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 5670,
        rating: 4.9,
        ratingCount: 1580,
        resources: {
          videos: [
            { title: "System Design Interview Course", url: "https://www.youtube.com/watch?v=UzLMhqg3_Wc", platform: "YouTube", videoId: "UzLMhqg3_Wc" },
            { title: "System Design Basics", url: "https://www.youtube.com/watch?v=xpDnVSmNnr0", platform: "YouTube", videoId: "xpDnVSmNnr0" },
            { title: "Microservices Architecture", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", platform: "YouTube", videoId: "rv4LlmLmVWk" },
            { title: "Designing Data-Intensive Applications", url: "https://www.youtube.com/watch?v=PdtlMd-6-p0", platform: "YouTube", videoId: "PdtlMd-6-p0" }
          ],
          pdfs: [
            { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
            { title: "Designing Data-Intensive Applications", url: "https://dataintensive.net/" },
            { title: "Google SRE Book", url: "https://sre.google/sre-book/table-of-contents/" }
          ],
          links: [
            { title: "ByteByteGo", url: "https://bytebytego.com/" },
            { title: "System Design Interview", url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
            { title: "High Scalability Blog", url: "http://highscalability.com/" },
            { title: "AWS Architecture Center", url: "https://aws.amazon.com/architecture/" }
          ]
        }
      },

      // 21. Next.js Full Stack Development
      {
        title: "Next.js Full Stack Development",
        instructor: "Josh Comeau",
        category: "Web Development",
        level: "Intermediate",
        duration: "12 weeks",
        description: "Next.js 14, App Router, Server Components, API routes, deployment",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 4120,
        rating: 4.9,
        ratingCount: 1120,
        resources: {
          videos: [
            { title: "Next.js 14 Full Course", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", platform: "YouTube", videoId: "wm5gMKuwSYk" },
            { title: "Next.js App Router Tutorial", url: "https://www.youtube.com/watch?v=gSSs-Qa3i48", platform: "YouTube", videoId: "gSSs-Qa3i48" },
            { title: "Next.js + TypeScript", url: "https://www.youtube.com/watch?v=d8M4q7vSP5w", platform: "YouTube", videoId: "d8M4q7vSP5w" },
            { title: "Deploy Next.js to Vercel", url: "https://www.youtube.com/watch?v=2HBIzEx6IZA", platform: "YouTube", videoId: "2HBIzEx6IZA" }
          ],
          pdfs: [
            { title: "Next.js Official Docs", url: "https://nextjs.org/docs" },
            { title: "React Server Components RFC", url: "https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md" },
            { title: "Vercel Deployment Guide", url: "https://vercel.com/docs" }
          ],
          links: [
            { title: "Next.js Learn", url: "https://nextjs.org/learn" },
            { title: "Vercel Platform", url: "https://vercel.com/" },
            { title: "shadcn/ui", url: "https://ui.shadcn.com/" },
            { title: "Next.js Examples", url: "https://github.com/vercel/next.js/tree/canary/examples" }
          ]
        }
      },

      // 22. TypeScript Complete Developer Guide
      {
        title: "TypeScript Complete Developer Guide",
        instructor: "Matt Pocock",
        category: "Programming",
        level: "Intermediate",
        duration: "8 weeks",
        description: "Types, generics, utility types, React + TypeScript patterns",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 6340,
        rating: 4.9,
        ratingCount: 1750,
        resources: {
          videos: [
            { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=30LW083Z9pk", platform: "YouTube", videoId: "30LW083Z9pk" },
            { title: "TypeScript for Beginners", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs", platform: "YouTube", videoId: "BwuLxPH8IDs" },
            { title: "Advanced TypeScript", url: "https://www.youtube.com/watch?v=HG6AyZtY5fY", platform: "YouTube", videoId: "HG6AyZtY5fY" },
            { title: "React + TypeScript", url: "https://www.youtube.com/watch?v=FJDVKeh7RJI", platform: "YouTube", videoId: "FJDVKeh7RJI" }
          ],
          pdfs: [
            { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
            { title: "TypeScript Deep Dive", url: "https://basarat.gitbook.io/typescript/" },
            { title: "Total TypeScript Cheatsheet", url: "https://www.totaltypescript.com/typescript-cheat-sheet" }
          ],
          links: [
            { title: "TypeScript Playground", url: "https://www.typescriptlang.org/play" },
            { title: "Total TypeScript", url: "https://www.totaltypescript.com/" },
            { title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges" },
            { title: "DefinitelyTyped", url: "https://github.com/DefinitelyTyped/DefinitelyTyped" }
          ]
        }
      },

      // 23. React Native Mobile App Development
      {
        title: "React Native Mobile App Development",
        instructor: "Simcoder",
        category: "Mobile Development",
        level: "Intermediate",
        duration: "14 weeks",
        description: "Build iOS & Android apps with React Native, Expo, navigation",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3780,
        rating: 4.8,
        ratingCount: 940,
        resources: {
          videos: [
            { title: "React Native Full Course 2024", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", platform: "YouTube", videoId: "0-S5a0eXPoc" },
            { title: "Expo Router Tutorial", url: "https://www.youtube.com/watch?v=Z20nUd9IsCQ", platform: "YouTube", videoId: "Z20nUd9IsCQ" },
            { title: "React Native Navigation", url: "https://www.youtube.com/watch?v=nQWFzMv_0ho", platform: "YouTube", videoId: "nQWFzMv_0ho" },
            { title: "Build & Publish to App Store", url: "https://www.youtube.com/watch?v=3bKZd0d5h1Y", platform: "YouTube", videoId: "3bKZd0d5h1Y" }
          ],
          pdfs: [
            { title: "React Native Docs", url: "https://reactnative.dev/docs/getting-started" },
            { title: "Expo Documentation", url: "https://docs.expo.dev/" },
            { title: "React Navigation Guide", url: "https://reactnavigation.org/docs/getting-started" }
          ],
          links: [
            { title: "Expo Platform", url: "https://expo.dev/" },
            { title: "React Native Directory", url: "https://reactnative.directory/" },
            { title: "App Store Connect", url: "https://developer.apple.com/app-store-connect/" },
            { title: "Google Play Console", url: "https://play.google.com/console/" }
          ]
        }
      },

      // 24. Flutter & Dart Complete Course
      {
        title: "Flutter & Dart Complete Course",
        instructor: "Maximilian Schwarzmüller",
        category: "Mobile Development",
        level: "Beginner",
        duration: "12 weeks",
        description: "Cross-platform mobile apps with Flutter, Dart, Firebase integration",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 4450,
        rating: 4.8,
        ratingCount: 1180,
        resources: {
          videos: [
            { title: "Flutter Full Course", url: "https://www.youtube.com/watch?v=VPvVDiRtE7c", platform: "YouTube", videoId: "VPvVDiRtE7c" },
            { title: "Dart Programming Tutorial", url: "https://www.youtube.com/watch?v=5xlVP049Itw", platform: "YouTube", videoId: "5xlVP049Itw" },
            { title: "Flutter State Management", url: "https://www.youtube.com/watch?v=ShnX5fF5T8c", platform: "YouTube", videoId: "ShnX5fF5T8c" },
            { title: "Flutter + Firebase", url: "https://www.youtube.com/watch?v=sz4slPFwEvs", platform: "YouTube", videoId: "sz4slPFwEvs" }
          ],
          pdfs: [
            { title: "Flutter Documentation", url: "https://docs.flutter.dev/" },
            { title: "Dart Language Tour", url: "https://dart.dev/language" },
            { title: "Flutter Cookbook", url: "https://docs.flutter.dev/cookbook" }
          ],
          links: [
            { title: "Flutter Dev", url: "https://flutter.dev/" },
            { title: "Pub.dev Packages", url: "https://pub.dev/" },
            { title: "FlutterFire", url: "https://firebase.flutter.dev/" },
            { title: "Flutter Samples", url: "https://flutter.github.io/samples/" }
          ]
        }
      },

      // 25. UI/UX Design with Figma
      {
        title: "UI/UX Design with Figma",
        instructor: "Mizko",
        category: "Design",
        level: "Beginner",
        duration: "10 weeks",
        description: "User research, wireframing, prototyping, design systems in Figma",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 5120,
        rating: 4.9,
        ratingCount: 1320,
        resources: {
          videos: [
            { title: "Figma UI/UX Design Tutorial", url: "https://www.youtube.com/watch?v=jwCmIBjm8NM", platform: "YouTube", videoId: "jwCmIBjm8NM" },
            { title: "UX Design Full Course", url: "https://www.youtube.com/watch?v=9B0mtpd0hXc", platform: "YouTube", videoId: "9B0mtpd0hXc" },
            { title: "Figma Auto Layout", url: "https://www.youtube.com/watch?v=HZuk6Wkx_Eg", platform: "YouTube", videoId: "HZuk6Wkx_Eg" },
            { title: "Design System in Figma", url: "https://www.youtube.com/watch?v=RYDiDpW2VkM", platform: "YouTube", videoId: "RYDiDpW2VkM" }
          ],
          pdfs: [
            { title: "Figma Learn Resources", url: "https://help.figma.com/hc/en-us" },
            { title: "Laws of UX", url: "https://lawsofux.com/" },
            { title: "Material Design Guidelines", url: "https://m3.material.io/" }
          ],
          links: [
            { title: "Figma Community", url: "https://www.figma.com/community" },
            { title: "Dribbble Inspiration", url: "https://dribbble.com/" },
            { title: "Behance Portfolio", url: "https://www.behance.net/" },
            { title: "Google UX Design Certificate", url: "https://grow.google/uxdesign/" }
          ]
        }
      },

      // 26. SQL & PostgreSQL Mastery
      {
        title: "SQL & PostgreSQL Mastery",
        instructor: "Amigoscode",
        category: "Data Science",
        level: "Beginner",
        duration: "8 weeks",
        description: "SQL queries, joins, indexes, PostgreSQL, database design",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 5890,
        rating: 4.9,
        ratingCount: 1480,
        resources: {
          videos: [
            { title: "SQL Full Course", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", platform: "YouTube", videoId: "HXV3zeQKqGY" },
            { title: "PostgreSQL Tutorial", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", platform: "YouTube", videoId: "qw--VYLpxG4" },
            { title: "Advanced SQL Queries", url: "https://www.youtube.com/watch?v=R3g4T3b4O3M", platform: "YouTube", videoId: "R3g4T3b4O3M" },
            { title: "Database Design Tutorial", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", platform: "YouTube", videoId: "ztHopE5Wnpc" }
          ],
          pdfs: [
            { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/" },
            { title: "SQL Style Guide", url: "https://www.sqlstyle.guide/" },
            { title: "Use The Index, Luke", url: "https://use-the-index-luke.com/" }
          ],
          links: [
            { title: "SQLBolt Interactive", url: "https://sqlbolt.com/" },
            { title: "LeetCode Database", url: "https://leetcode.com/problemset/database/" },
            { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
            { title: "DB Fiddle", url: "https://www.db-fiddle.com/" }
          ]
        }
      },

      // 27. Java Spring Boot Microservices
      {
        title: "Java Spring Boot Microservices",
        instructor: "Amigoscode",
        category: "Programming",
        level: "Intermediate",
        duration: "14 weeks",
        description: "Spring Boot, REST APIs, JPA, microservices, Docker deployment",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3670,
        rating: 4.8,
        ratingCount: 890,
        resources: {
          videos: [
            { title: "Spring Boot Full Course", url: "https://www.youtube.com/watch?v=9SGDpanrc8U", platform: "YouTube", videoId: "9SGDpanrc8U" },
            { title: "Java Full Course", url: "https://www.youtube.com/watch?v=eIrMbAQSU34", platform: "YouTube", videoId: "eIrMbAQSU34" },
            { title: "Spring Boot Microservices", url: "https://www.youtube.com/watch?v=mPPhcU7odQM", platform: "YouTube", videoId: "mPPhcU7odQM" },
            { title: "Spring Security Tutorial", url: "https://www.youtube.com/watch?v=Gj5o4HqSTyA", platform: "YouTube", videoId: "Gj5o4HqSTyA" }
          ],
          pdfs: [
            { title: "Spring Boot Reference", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/" },
            { title: "Effective Java (Guide)", url: "https://www.oracle.com/java/technologies/javase/codeconventions-contents.html" },
            { title: "Microservices Patterns", url: "https://microservices.io/patterns/index.html" }
          ],
          links: [
            { title: "Spring Initializr", url: "https://start.spring.io/" },
            { title: "Spring Guides", url: "https://spring.io/guides" },
            { title: "Baeldung Tutorials", url: "https://www.baeldung.com/" },
            { title: "Java Documentation", url: "https://docs.oracle.com/en/java/" }
          ]
        }
      },

      // 28. AWS Solutions Architect Certification Prep
      {
        title: "AWS Solutions Architect Certification Prep",
        instructor: "Stephane Maarek",
        category: "Cloud & DevOps",
        level: "Intermediate",
        duration: "10 weeks",
        description: "EC2, S3, RDS, Lambda, VPC — pass the AWS SAA-C03 exam",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 4230,
        rating: 4.9,
        ratingCount: 1150,
        resources: {
          videos: [
            { title: "AWS Solutions Architect Course", url: "https://www.youtube.com/watch?v=c3Cn4xYfxJY", platform: "YouTube", videoId: "c3Cn4xYfxJY" },
            { title: "AWS EC2 Deep Dive", url: "https://www.youtube.com/watch?v=7m_q1ldzw0U", platform: "YouTube", videoId: "7m_q1ldzw0U" },
            { title: "AWS S3 Complete Guide", url: "https://www.youtube.com/watch?v=77lMCiiMilo", platform: "YouTube", videoId: "77lMCiiMilo" },
            { title: "AWS Lambda Tutorial", url: "https://www.youtube.com/watch?v=eOBq__bYWQo", platform: "YouTube", videoId: "eOBq__bYWQo" }
          ],
          pdfs: [
            { title: "AWS SAA Exam Guide", url: "https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf" },
            { title: "AWS Well-Architected Framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html" },
            { title: "AWS Whitepapers", url: "https://aws.amazon.com/whitepapers/" }
          ],
          links: [
            { title: "AWS Skill Builder", url: "https://skillbuilder.aws/" },
            { title: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
            { title: "Tutorials Dojo Practice", url: "https://tutorialsdojo.com/" },
            { title: "AWS Architecture Icons", url: "https://aws.amazon.com/architecture/icons/" }
          ]
        }
      },

      // 29. Competitive Programming Bootcamp
      {
        title: "Competitive Programming Bootcamp",
        instructor: "William Lin",
        category: "Programming",
        level: "Advanced",
        duration: "20 weeks",
        description: "Codeforces, AtCoder, ICPC prep — advanced algorithms & math",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 2890,
        rating: 4.9,
        ratingCount: 720,
        resources: {
          videos: [
            { title: "Competitive Programming Course", url: "https://www.youtube.com/watch?v=8hly31xKli0", platform: "YouTube", videoId: "8hly31xKli0" },
            { title: "CP Algorithms Explained", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", platform: "YouTube", videoId: "09_LlHjoEiY" },
            { title: "Number Theory for CP", url: "https://www.youtube.com/watch?v=ugFnF67t6PI", platform: "YouTube", videoId: "ugFnF67t6PI" },
            { title: "Segment Trees Tutorial", url: "https://www.youtube.com/watch?v=O26YVNm0xA0", platform: "YouTube", videoId: "O26YVNm0xA0" }
          ],
          pdfs: [
            { title: "Competitive Programmer's Handbook", url: "https://cses.fi/book/book.pdf" },
            { title: "CP-Algorithms", url: "https://cp-algorithms.com/" },
            { title: "USACO Guide", url: "https://usaco.guide/" }
          ],
          links: [
            { title: "Codeforces", url: "https://codeforces.com/" },
            { title: "AtCoder", url: "https://atcoder.jp/" },
            { title: "CSES Problem Set", url: "https://cses.fi/problemset/" },
            { title: "CodeChef", url: "https://www.codechef.com/" }
          ]
        }
      },

      // 30. Digital Marketing & SEO Fundamentals
      {
        title: "Digital Marketing & SEO Fundamentals",
        instructor: "Neil Patel",
        category: "Business",
        level: "Beginner",
        duration: "8 weeks",
        description: "SEO, Google Analytics, social media marketing, content strategy",
        ownerId: instructorUser._id,
        isPublished: true,
        isActive: true,
        price: 0,
        enrollmentCount: 3560,
        rating: 4.7,
        ratingCount: 810,
        resources: {
          videos: [
            { title: "Digital Marketing Full Course", url: "https://www.youtube.com/watch?v=z0G39lT_o9U", platform: "YouTube", videoId: "z0G39lT_o9U" },
            { title: "SEO Tutorial for Beginners", url: "https://www.youtube.com/watch?v=xsVTqzratPs", platform: "YouTube", videoId: "xsVTqzratPs" },
            { title: "Google Analytics 4 Tutorial", url: "https://www.youtube.com/watch?v=G6X1o8eX5Hk", platform: "YouTube", videoId: "G6X1o8eX5Hk" },
            { title: "Social Media Marketing", url: "https://www.youtube.com/watch?v=9UdYB2Og4HE", platform: "YouTube", videoId: "9UdYB2Og4HE" }
          ],
          pdfs: [
            { title: "Google SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
            { title: "HubSpot Marketing Guide", url: "https://www.hubspot.com/marketing" },
            { title: "Content Marketing Institute", url: "https://contentmarketinginstitute.com/" }
          ],
          links: [
            { title: "Google Search Console", url: "https://search.google.com/search-console" },
            { title: "Google Analytics", url: "https://analytics.google.com/" },
            { title: "Ahrefs Blog", url: "https://ahrefs.com/blog/" },
            { title: "Moz SEO Learning", url: "https://moz.com/learn/seo" }
          ]
        }
      }
    ];

    const seededCourses = await Course.create(coursesToSeed);
    logger.info(`✅ Seeded ${seededCourses.length} Courses (all with full media resources!)`);

    // Print summary
    seededCourses.forEach(c => {
      const vCount = c.resources?.videos?.length || 0;
      const pCount = c.resources?.pdfs?.length || 0;
      const lCount = c.resources?.links?.length || 0;
      logger.info(`   📚 ${c.title} → ${vCount} videos, ${pCount} PDFs, ${lCount} links`);
    });

    // 2. Seed Events
    const eventsToSeed = [
      {
        title: "SkillVerse Global Hackathon 2024",
        description: "Join the biggest virtual hackathon. Win prizes and get job offers from top tech companies!",
        eventType: "hackathon",
        location: "Virtual HQ",
        isOnline: true,
        eventLink: "https://hackathon.skillverse.com",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        organizerId: adminUser._id,
        visibility: "public",
        capacity: 2000,
        registeredCount: 450
      },
      {
        title: "Into the Cloud: Azure vs AWS",
        description: "An expert webinar discussing the current state of cloud architecture.",
        eventType: "webinar",
        location: "Zoom",
        isOnline: true,
        eventLink: "https://zoom.auth/skillverse",
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        organizerId: instructorUser._id,
        visibility: "public",
        capacity: 500,
        registeredCount: 320
      },
      {
        title: "Bangalore Frontend Meetup",
        description: "Let's talk React 19 and the future of web rendering! Free pizza provided.",
        eventType: "meetup",
        location: "WeWork Koramangala, Bangalore",
        isOnline: false,
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        organizerId: adminUser._id,
        visibility: "public",
        capacity: 100,
        registeredCount: 85
      },
      {
        title: "AI Startup Pitch Day",
        description: "Have a brilliant AI idea? Pitch it directly to seed investors and VCs.",
        eventType: "conference",
        location: "Online",
        isOnline: true,
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
        organizerId: adminUser._id,
        visibility: "private",
        capacity: 50,
        registeredCount: 15
      },
      {
        title: "Live Mock DSA Interview",
        description: "Watch a mock interview between an ex-FAANG engineer and a student.",
        eventType: "live_class",
        location: "YouTube Live",
        isOnline: true,
        startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        organizerId: instructorUser._id,
        visibility: "public"
      }
    ];

    const seededEvents = await Event.create(eventsToSeed);
    logger.info(`✅ Seeded ${seededEvents.length} Events`);

    logger.info('');
    logger.info('🚀 ═══════════════════════════════════════════════════════════');
    logger.info('🚀 Massive Data Seeding Completed Successfully!');
    logger.info(`🚀 Total Courses: ${seededCourses.length} (ALL with videos, PDFs, links)`);
    logger.info(`🚀 Total Events: ${seededEvents.length}`);
    logger.info('🚀 You can now check the frontend!');
    logger.info('🚀 ═══════════════════════════════════════════════════════════');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
};

seedMassiveData();
