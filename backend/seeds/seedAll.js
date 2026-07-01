import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

// Models
import User from '../models/User.js';
import Course from '../models/Course.js';
import Problem from '../models/Problem.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // 0. Clear Everything
    await User.deleteMany({});
    await Course.deleteMany({});
    await Problem.deleteMany({});
    await Job.deleteMany({});
    await Event.deleteMany({});
    logger.info('🗑️  Cleared existing database state');

    // 1. Seed Users
    const users = await User.create([
      {
        name: "Admin User",
        email: "subbareddy123sub@gmail.com",
        password: "Subbareddy@123",
        role: "admin",
        bio: "SkillVerse Platform Administrator"
      },
      {
        name: "Mike Instructor",
        email: "mike@skillverse.com",
        password: "Password123!",
        role: "instructor",
        bio: "Expert Full Stack Instructor"
      },
      {
        name: "John Student",
        email: "john@skillverse.com",
        password: "Password123!",
        role: "student",
        bio: "Learning AI and Web Dev"
      }
    ]);
    const adminId = users[0]._id;
    const instructorId = users[1]._id;
    logger.info(`✅ Seeded ${users.length} users`);

    // 2. Seed Courses with Web Dev Videos
    const courses = await Course.create([
      {
        title: "Full Stack Web Development",
        description: "Complete MERN Stack - HTML, CSS, JavaScript, React, Node.js, MongoDB",
        category: "Web Development",
        level: "Beginner",
        ownerId: instructorId,
        isPublished: true,
        duration: "12 Weeks",
        price: 0,
        resources: {
          videos: [
            {
              title: "HTML Fundamentals - Tags & Structure",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
              platform: "Web",
              videoId: "html-fundamentals-001",
              duration: 3600
            },
            {
              title: "CSS Styling & Layouts",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
              platform: "Web",
              videoId: "css-styling-002",
              duration: 3480
            },
            {
              title: "Flexbox & Responsive Design",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
              platform: "Web",
              videoId: "flexbox-responsive-003",
              duration: 3600
            },
            {
              title: "CSS Grid & Advanced Layouts",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
              platform: "Web",
              videoId: "grid-advanced-004",
              duration: 3420
            },
            {
              title: "JavaScript Variables & Functions",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
              platform: "Web",
              videoId: "js-fundamentals-005",
              duration: 3600
            },
            {
              title: "DOM Manipulation & Selectors",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              platform: "Web",
              videoId: "dom-manipulation-006",
              duration: 3480
            },
            {
              title: "Event Handling & Listeners",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              platform: "Web",
              videoId: "events-listeners-007",
              duration: 3300
            },
            {
              title: "Fetch API & Promises",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
              platform: "Web",
              videoId: "fetch-promises-008",
              duration: 3600
            },
            {
              title: "React Components & JSX",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
              platform: "Web",
              videoId: "react-components-009",
              duration: 3480
            },
            {
              title: "Node.js & Express Basics",
              url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
              platform: "Web",
              videoId: "nodejs-express-010",
              duration: 3600
            }
          ],
          pdfs: [],
          links: []
        }
      },
      {
        title: "AI & Machine Learning Foundations",
        description: "Introduction to Neural Networks and Data Science",
        category: "AI & ML",
        level: "Intermediate",
        ownerId: instructorId,
        isPublished: true,
        duration: "10 Weeks"
      }
    ]);
    logger.info(`✅ Seeded ${courses.length} courses with Web Dev video resources`);

    // 3. Seed Problems
    const problems = await Problem.create([
      {
        title: "Two Sum",
        description: "Find indices of two numbers that add up to target",
        difficulty: "Easy",
        category: "Arrays",
        source: "LeetCode",
        externalId: "1",
        externalUrl: "https://leetcode.com/problems/two-sum/",
        relatedCourse: courses[0]._id,
        createdBy: adminId
      },
      {
        title: "Matrix Chain Multiplication",
        description: "Dynamic programming problem on matrix multiplication",
        difficulty: "Hard",
        category: "Dynamic Programming",
        source: "GeeksforGeeks",
        externalId: "mcm",
        externalUrl: "https://www.geeksforgeeks.org/matrix-chain-multiplication/",
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${problems.length} problems`);

    // 4. Seed Jobs
    const jobs = await Job.create([
      {
        jobId: "j1",
        title: "Frontend Intern",
        company: "SkillVerse Tech",
        location: "Remote",
        type: "Internship",
        description: "Work on our React frontend",
        applyLink: "https://skillverse.com/careers",
        isActive: true,
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${jobs.length} jobs`);

    // 5. Seed Events
    const getRandomDate = () => {
      const daysOffset = Math.floor(Math.random() * 60) + 5;
      return new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000);
    };

    const events = await Event.create([
      {
        title: "SkillVerse Tech Hackathon 2024",
        description: "Compete and win prizes! Build innovative solutions with top tech stacks. Prizes worth $10,000!",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "hackathon",
        organizerId: adminId,
        visibility: "public",
        capacity: 500,
        type: "Competition",
        date: "May 25, 2024",
        time: "2:00 PM",
        venue: "Online",
        duration: "24 hours",
        mode: "online",
        maxAttendees: 500,
        attendees: 245,
        category: "hackathons",
        createdBy: adminId
      },
      {
        title: "Web Development Masterclass",
        description: "Learn modern web development with React, Node.js, and MongoDB. Hands-on workshop with live coding.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 200,
        type: "Workshop",
        date: "May 28, 2024",
        time: "10:00 AM",
        venue: "Online - Zoom",
        duration: "3 hours",
        mode: "online",
        maxAttendees: 200,
        attendees: 156,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "AI & Machine Learning Bootcamp",
        description: "Deep dive into AI/ML fundamentals. Learn Python, TensorFlow, and build real-world AI applications.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Tech Campus, Building A",
        isOnline: false,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 150,
        type: "Learning",
        date: "June 1, 2024",
        time: "1:30 PM",
        venue: "Tech Campus, Building A",
        duration: "2 hours",
        mode: "offline",
        maxAttendees: 150,
        attendees: 98,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Networking Mixer - Tech & Finance",
        description: "Meet professionals from top tech and finance companies. Build your network and explore career opportunities.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Grand Hotel Conference Room",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 300,
        type: "Social",
        date: "June 5, 2024",
        time: "6:00 PM",
        venue: "Grand Hotel Conference Room",
        duration: "2 hours",
        mode: "offline",
        maxAttendees: 300,
        attendees: 267,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Cloud Computing with AWS",
        description: "Master AWS cloud services. Learn deployment, scaling, and best practices for cloud applications.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 250,
        type: "Learning",
        date: "June 8, 2024",
        time: "2:00 PM",
        venue: "Google Meet",
        duration: "3 hours",
        mode: "online",
        maxAttendees: 250,
        attendees: 189,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Startup Pitch Competition",
        description: "Pitch your startup ideas! Winners get mentorship and seed funding opportunities. Sign up your team now!",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 4 * 60 * 60 * 1000),
        location: "Innovation Hub",
        isOnline: false,
        eventType: "conference",
        organizerId: adminId,
        visibility: "public",
        capacity: 100,
        type: "Competition",
        date: "June 10, 2024",
        time: "10:00 AM",
        venue: "Innovation Hub, Main Hall",
        duration: "4 hours",
        mode: "offline",
        maxAttendees: 100,
        attendees: 78,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Python Data Science Essentials",
        description: "Become a data scientist! Learn pandas, numpy, matplotlib, and basic ML algorithms.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "live_class",
        organizerId: adminId,
        visibility: "public",
        capacity: 300,
        type: "Learning",
        date: "June 12, 2024",
        time: "3:00 PM",
        venue: "YouTube Live",
        duration: "2 hours",
        mode: "online",
        maxAttendees: 300,
        attendees: 234,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Annual Tech Conference 2024",
        description: "The biggest tech event of the year! 50+ speakers, 10 tracks, career fair, and networking sessions.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 8 * 60 * 60 * 1000),
        location: "Convention Center",
        isOnline: false,
        eventType: "conference",
        organizerId: adminId,
        visibility: "public",
        capacity: 2000,
        type: "Learning",
        date: "June 15-16, 2024",
        time: "9:00 AM",
        venue: "International Convention Center",
        duration: "Full Day",
        mode: "offline",
        maxAttendees: 2000,
        attendees: 1856,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "UI/UX Design Workshop",
        description: "Learn modern design principles, Figma, prototyping, and user research techniques.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2.5 * 60 * 60 * 1000),
        location: "Design Studio",
        isOnline: false,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 80,
        type: "Workshop",
        date: "June 18, 2024",
        time: "11:00 AM",
        venue: "Creative Design Studio",
        duration: "2.5 hours",
        mode: "offline",
        maxAttendees: 80,
        attendees: 62,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Adventure Trek - Hill Station Expedition",
        description: "Experience nature! 3-day trek to the beautiful mountain ranges with camping and team building.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 24 * 60 * 60 * 1000),
        location: "Mountain Range, State",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 50,
        type: "Adventure",
        date: "July 1-3, 2024",
        time: "8:00 AM",
        venue: "Hill Station Base Camp",
        duration: "3 days",
        mode: "offline",
        maxAttendees: 50,
        attendees: 38,
        category: "fun-tours",
        createdBy: adminId
      },
      {
        title: "Industrial Visit - Tech Giants Factory",
        description: "Visit leading tech company manufacturing facilities. Learn about production, quality, and innovation.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 4 * 60 * 60 * 1000),
        location: "Tech Manufacturing Plant",
        isOnline: false,
        eventType: "conference",
        organizerId: adminId,
        visibility: "public",
        capacity: 120,
        type: "Learning",
        date: "July 5, 2024",
        time: "9:00 AM",
        venue: "Tech Manufacturing Facility, City",
        duration: "4 hours",
        mode: "offline",
        maxAttendees: 120,
        attendees: 108,
        category: "industrial-tours",
        createdBy: adminId
      },
      {
        title: "Cybersecurity & Ethical Hacking",
        description: "Learn security best practices, penetration testing, and ethical hacking. Hands-on labs included.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 200,
        type: "Workshop",
        date: "July 8, 2024",
        time: "4:00 PM",
        venue: "Zoom Workshop Hall",
        duration: "3 hours",
        mode: "online",
        maxAttendees: 200,
        attendees: 145,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Cultural Night - Traditional Performances",
        description: "Celebrate diversity! Traditional dance, music, food, and cultural performances from around the world.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Campus Auditorium",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 500,
        type: "Social",
        date: "July 10, 2024",
        time: "7:00 PM",
        venue: "Main Campus Auditorium",
        duration: "3 hours",
        mode: "offline",
        maxAttendees: 500,
        attendees: 423,
        category: "cultural",
        createdBy: adminId
      },
      {
        title: "Mobile App Development Summit",
        description: "Create awesome mobile apps! Learn React Native, Flutter, and iOS/Android native development.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 1 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "webinar",
        organizerId: adminId,
        visibility: "public",
        capacity: 400,
        type: "Learning",
        date: "July 12, 2024",
        time: "5:00 PM",
        venue: "Microsoft Teams",
        duration: "1 hour",
        mode: "online",
        maxAttendees: 400,
        attendees: 312,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "DevOps & Docker Fundamentals",
        description: "Master containerization and DevOps practices. Hands-on with Docker, Kubernetes, and CI/CD pipelines.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2.5 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 150,
        type: "Workshop",
        date: "July 15, 2024",
        time: "3:00 PM",
        venue: "Google Meet",
        duration: "2.5 hours",
        mode: "online",
        maxAttendees: 150,
        attendees: 124,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Blockchain & Web3 Revolution",
        description: "Explore blockchain technology, smart contracts, NFTs, and build your first Web3 application.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Tech Hub Downtown",
        isOnline: false,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 100,
        type: "Learning",
        date: "July 18, 2024",
        time: "2:00 PM",
        venue: "Tech Hub Downtown, Conference Hall",
        duration: "2 hours",
        mode: "offline",
        maxAttendees: 100,
        attendees: 87,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Product Management Masterclass",
        description: "Learn product strategy, user research, and building products that customers love.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "live_class",
        organizerId: adminId,
        visibility: "public",
        capacity: 300,
        type: "Learning",
        date: "July 20, 2024",
        time: "10:00 AM",
        venue: "YouTube Live",
        duration: "3 hours",
        mode: "online",
        maxAttendees: 300,
        attendees: 267,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Sports Day - Badminton Tournament",
        description: "Annual badminton championship with prizes and recognition. Open to all skill levels.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 4 * 60 * 60 * 1000),
        location: "Campus Sports Complex",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 200,
        type: "Social",
        date: "July 22, 2024",
        time: "9:00 AM",
        venue: "Campus Sports Complex",
        duration: "4 hours",
        mode: "offline",
        maxAttendees: 200,
        attendees: 156,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Business & Entrepreneurship Summit",
        description: "Learn from successful founders and entrepreneurs. Business plans, funding, and scaling strategies.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 5 * 60 * 60 * 1000),
        location: "Convention Center",
        isOnline: false,
        eventType: "conference",
        organizerId: adminId,
        visibility: "public",
        capacity: 400,
        type: "Learning",
        date: "July 25, 2024",
        time: "9:30 AM",
        venue: "Grand Convention Center, Main Hall",
        duration: "5 hours",
        mode: "offline",
        maxAttendees: 400,
        attendees: 368,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Database Design & Optimization",
        description: "SQL vs NoSQL, indexing, query optimization, and database architecture best practices.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 200,
        type: "Workshop",
        date: "July 28, 2024",
        time: "1:00 PM",
        venue: "Zoom Workshop",
        duration: "2 hours",
        mode: "online",
        maxAttendees: 200,
        attendees: 167,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Mental Health & Wellness Awareness",
        description: "Webinar on stress management, meditation, and mental wellness. Featuring expert psychologists.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 1.5 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "webinar",
        organizerId: adminId,
        visibility: "public",
        capacity: 500,
        type: "Social",
        date: "July 30, 2024",
        time: "4:00 PM",
        venue: "Google Meet Live",
        duration: "1.5 hours",
        mode: "online",
        maxAttendees: 500,
        attendees: 445,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Game Development with Unity",
        description: "Learn game development using Unity engine. Build 2D games and publish on mobile platforms.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Lab Room 5, Tech Building",
        isOnline: false,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 60,
        type: "Workshop",
        date: "Aug 2, 2024",
        time: "10:00 AM",
        venue: "Lab Room 5, Tech Building",
        duration: "3 hours",
        mode: "offline",
        maxAttendees: 60,
        attendees: 48,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Environmental Conservation Trek",
        description: "Join us for a nature-friendly trek focusing on environmental awareness and conservation.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 24 * 60 * 60 * 1000),
        location: "Eco Park & Forest Reserve",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 40,
        type: "Adventure",
        date: "Aug 5-6, 2024",
        time: "7:00 AM",
        venue: "Eco Park Entrance",
        duration: "2 days",
        mode: "offline",
        maxAttendees: 40,
        attendees: 32,
        category: "fun-tours",
        createdBy: adminId
      },
      {
        title: "Interview Preparation & Soft Skills",
        description: "Master job interviews, salary negotiation, and essential soft skills for career success.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "live_class",
        organizerId: adminId,
        visibility: "public",
        capacity: 300,
        type: "Learning",
        date: "Aug 8, 2024",
        time: "6:00 PM",
        venue: "Zoom Webinar",
        duration: "2 hours",
        mode: "online",
        maxAttendees: 300,
        attendees: 278,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "GraphQL & Modern API Design",
        description: "Build scalable APIs with GraphQL. Learn alternatives to REST and best practices.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2.5 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 180,
        type: "Workshop",
        date: "Aug 10, 2024",
        time: "2:00 PM",
        venue: "Microsoft Teams",
        duration: "2.5 hours",
        mode: "online",
        maxAttendees: 180,
        attendees: 143,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Open Source Contributing Guide",
        description: "Learn how to contribute to open source projects and make a global impact.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 2 * 60 * 60 * 1000),
        location: "Virtual",
        isOnline: true,
        eventType: "webinar",
        organizerId: adminId,
        visibility: "public",
        capacity: 250,
        type: "Learning",
        date: "Aug 12, 2024",
        time: "3:00 PM",
        venue: "YouTube Live",
        duration: "2 hours",
        mode: "online",
        maxAttendees: 250,
        attendees: 198,
        category: "technical",
        createdBy: adminId
      },
      {
        title: "Leadership & Team Building Workshop",
        description: "Develop leadership qualities and learn effective team management strategies.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 4 * 60 * 60 * 1000),
        location: "Resort Conference Center",
        isOnline: false,
        eventType: "workshop",
        organizerId: adminId,
        visibility: "public",
        capacity: 100,
        type: "Learning",
        date: "Aug 15, 2024",
        time: "9:00 AM",
        venue: "Resort Conference Center",
        duration: "4 hours",
        mode: "offline",
        maxAttendees: 100,
        attendees: 89,
        category: "non-technical",
        createdBy: adminId
      },
      {
        title: "Tech Talent Show & Prize Money",
        description: "Showcase your talents! Singing, dancing, comedy, performances. Win prizes and get featured.",
        startDate: getRandomDate(),
        endDate: new Date(getRandomDate().getTime() + 3 * 60 * 60 * 1000),
        location: "Campus Auditorium",
        isOnline: false,
        eventType: "meetup",
        organizerId: adminId,
        visibility: "public",
        capacity: 800,
        type: "Social",
        date: "Aug 18, 2024",
        time: "6:00 PM",
        venue: "Main Campus Auditorium",
        duration: "3 hours",
        mode: "offline",
        maxAttendees: 800,
        attendees: 712,
        category: "cultural",
        createdBy: adminId
      }
    ]);
    logger.info(`✅ Seeded ${events.length} events`);

    logger.info('🚀 Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
};

seedAll();
