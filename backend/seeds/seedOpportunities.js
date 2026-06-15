// ============================================================
// SEED DATA — Sample Opportunities for Risee Career Hub
// ============================================================
// Run: node seeds/seedOpportunities.js
// Seeds 50 diverse opportunities across jobs, internships, and places.
// ============================================================

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import Opportunity from '../models/Opportunity.js';
import logger from '../config/logger.js';

const sampleOpportunities = [
  // ── INTERNSHIPS ─────────────────────────────────────────────
  {
    title: 'Backend Developer Intern',
    organization: 'TechNova',
    type: 'internship',
    location: 'Remote',
    description: 'Build scalable APIs using Node.js and MongoDB. Work with a fast-paced engineering team on real production systems.',
    skills: ['Node.js', 'MongoDB', 'Express.js', 'REST APIs'],
    applyLink: 'https://technova.com/careers/backend-intern',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'Frontend Engineering Intern',
    organization: 'PixelCraft Studios',
    type: 'internship',
    location: 'Bangalore',
    description: 'Design and develop responsive UI components using React and TypeScript. Collaborate closely with the design team.',
    skills: ['React', 'TypeScript', 'CSS', 'Figma'],
    applyLink: 'https://pixelcraft.io/apply',
    source: 'manual',
    postedAt: new Date('2026-03-02'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Data Science Intern',
    organization: 'DataMinds AI',
    type: 'internship',
    location: 'Hyderabad',
    description: 'Analyze large datasets, build ML models, and create dashboards. Python and SQL proficiency required.',
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Tableau'],
    applyLink: 'https://dataminds.ai/internships',
    source: 'manual',
    postedAt: new Date('2026-03-03'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Cloud Engineering Intern',
    organization: 'SkyStack Technologies',
    type: 'internship',
    location: 'Remote',
    description: 'Deploy and manage cloud infrastructure using AWS. Write Infrastructure-as-Code with Terraform.',
    skills: ['AWS', 'Terraform', 'Docker', 'Linux', 'CI/CD'],
    applyLink: 'https://skystack.tech/careers',
    source: 'manual',
    postedAt: new Date('2026-03-04'),
    expiresAt: new Date('2026-06-30')
  },
  {
    title: 'Mobile Development Intern',
    organization: 'AppForge',
    type: 'internship',
    location: 'Mumbai',
    description: 'Build cross-platform mobile applications using React Native. Focus on performance optimization and UX.',
    skills: ['React Native', 'JavaScript', 'Firebase', 'REST APIs'],
    applyLink: 'https://appforge.dev/apply',
    source: 'manual',
    postedAt: new Date('2026-02-28'),
    expiresAt: new Date('2026-05-20')
  },
  {
    title: 'DevOps Intern',
    organization: 'ContinuousOps',
    type: 'internship',
    location: 'Pune',
    description: 'Automate CI/CD pipelines, manage Kubernetes clusters, and monitor production systems.',
    skills: ['Kubernetes', 'Docker', 'GitHub Actions', 'Prometheus', 'Linux'],
    applyLink: 'https://continuousops.com/intern',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-07-01')
  },
  {
    title: 'UI/UX Design Intern',
    organization: 'DesignLab Pro',
    type: 'internship',
    location: 'Remote',
    description: 'Create wireframes, prototypes, and high-fidelity designs for web and mobile products using Figma.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    applyLink: 'https://designlabpro.com/internships',
    source: 'manual',
    postedAt: new Date('2026-03-06'),
    expiresAt: new Date('2026-06-15')
  },
  {
    title: 'Cybersecurity Intern',
    organization: 'SecureNet Labs',
    type: 'internship',
    location: 'Chennai',
    description: 'Conduct vulnerability assessments, assist in penetration testing, and help improve security protocols.',
    skills: ['Network Security', 'Linux', 'Python', 'OWASP', 'Burp Suite'],
    applyLink: 'https://securenetlabs.com/apply',
    source: 'manual',
    postedAt: new Date('2026-03-07'),
    expiresAt: new Date('2026-06-20')
  },
  {
    title: 'AI/ML Research Intern',
    organization: 'NeuralPath AI',
    type: 'internship',
    location: 'Bangalore',
    description: 'Research and implement deep learning models for NLP and computer vision applications.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision'],
    applyLink: 'https://neuralpath.ai/research-intern',
    source: 'manual',
    postedAt: new Date('2026-03-08'),
    expiresAt: new Date('2026-07-15')
  },
  {
    title: 'Blockchain Development Intern',
    organization: 'ChainVerse',
    type: 'internship',
    location: 'Remote',
    description: 'Develop smart contracts on Ethereum and Solana. Contribute to DeFi protocol development.',
    skills: ['Solidity', 'Web3.js', 'Ethereum', 'Rust', 'Smart Contracts'],
    applyLink: 'https://chainverse.io/join',
    source: 'manual',
    postedAt: new Date('2026-03-09'),
    expiresAt: new Date('2026-06-30')
  },

  // ── JOBS ────────────────────────────────────────────────────
  {
    title: 'Senior Full-Stack Developer',
    organization: 'CloudMatrix Inc.',
    type: 'job',
    location: 'Hyderabad',
    description: 'Lead full-stack development of SaaS products. 3+ years experience with React, Node.js, and PostgreSQL.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'],
    applyLink: 'https://cloudmatrix.com/careers/senior-fullstack',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-04-30')
  },
  {
    title: 'Machine Learning Engineer',
    organization: 'DeepSense Analytics',
    type: 'job',
    location: 'Bangalore',
    description: 'Design, train, and deploy ML models at scale. Experience with MLOps and cloud deployment required.',
    skills: ['Python', 'TensorFlow', 'MLOps', 'Docker', 'GCP'],
    applyLink: 'https://deepsense.in/ml-engineer',
    source: 'manual',
    postedAt: new Date('2026-03-02'),
    expiresAt: new Date('2026-05-10')
  },
  {
    title: 'Product Manager',
    organization: 'LaunchPad Ventures',
    type: 'job',
    location: 'Mumbai',
    description: 'Own the product roadmap, work with engineering and design teams, and drive product-market fit.',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Stakeholder Management'],
    applyLink: 'https://launchpadventures.com/pm-role',
    source: 'manual',
    postedAt: new Date('2026-03-03'),
    expiresAt: new Date('2026-04-20')
  },
  {
    title: 'Site Reliability Engineer',
    organization: 'UpTime Systems',
    type: 'job',
    location: 'Remote',
    description: 'Ensure 99.99% uptime for production services. Build monitoring, alerting, and auto-healing infrastructure.',
    skills: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'Go'],
    applyLink: 'https://uptimesystems.com/sre',
    source: 'manual',
    postedAt: new Date('2026-03-04'),
    expiresAt: new Date('2026-05-25')
  },
  {
    title: 'iOS Developer',
    organization: 'Swiftly Apps',
    type: 'job',
    location: 'Pune',
    description: 'Build native iOS applications using Swift and SwiftUI. Experience with Core Data and ARKit is a plus.',
    skills: ['Swift', 'SwiftUI', 'Core Data', 'Xcode', 'REST APIs'],
    applyLink: 'https://swiftlyapps.com/ios-dev',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-05-01')
  },
  {
    title: 'Data Engineer',
    organization: 'PipelineIO',
    type: 'job',
    location: 'Hyderabad',
    description: 'Design and maintain ETL pipelines using Apache Spark and Airflow. Process petabyte-scale data.',
    skills: ['Apache Spark', 'Airflow', 'Python', 'SQL', 'AWS Glue'],
    applyLink: 'https://pipelineio.com/data-engineer',
    source: 'manual',
    postedAt: new Date('2026-03-06'),
    expiresAt: new Date('2026-05-20')
  },
  {
    title: 'Security Analyst',
    organization: 'CyberGuard Solutions',
    type: 'job',
    location: 'Chennai',
    description: 'Monitor security events, respond to incidents, and improve organizational security posture.',
    skills: ['SIEM', 'Incident Response', 'Network Security', 'Python', 'Splunk'],
    applyLink: 'https://cyberguard.com/security-analyst',
    source: 'manual',
    postedAt: new Date('2026-03-07'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Technical Writer',
    organization: 'DocuFlow',
    type: 'job',
    location: 'Remote',
    description: 'Create developer-facing documentation, API references, and technical guides for SaaS products.',
    skills: ['Technical Writing', 'Markdown', 'API Documentation', 'Git'],
    applyLink: 'https://docuflow.io/careers',
    source: 'manual',
    postedAt: new Date('2026-03-08'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'Backend Engineer (Golang)',
    organization: 'GoScale',
    type: 'job',
    location: 'Bangalore',
    description: 'Build high-performance microservices in Go. Design scalable distributed systems.',
    skills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Docker'],
    applyLink: 'https://goscale.dev/backend-go',
    source: 'manual',
    postedAt: new Date('2026-03-09'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'QA Automation Engineer',
    organization: 'TestCraft',
    type: 'job',
    location: 'Noida',
    description: 'Build and maintain automated test suites using Selenium and Cypress. Improve test coverage and CI pipelines.',
    skills: ['Selenium', 'Cypress', 'JavaScript', 'CI/CD', 'Jest'],
    applyLink: 'https://testcraft.com/qa-automation',
    source: 'manual',
    postedAt: new Date('2026-02-25'),
    expiresAt: new Date('2026-04-15')
  },

  // ── PLACES ──────────────────────────────────────────────────
  {
    title: 'Google Summer of Code 2026',
    organization: 'Google',
    type: 'place',
    location: 'Remote',
    description: 'A global, online program focused on bringing new contributors into open source software organizations.',
    skills: ['Open Source', 'Git', 'Programming'],
    applyLink: 'https://summerofcode.withgoogle.com/',
    source: 'manual',
    postedAt: new Date('2026-01-15'),
    expiresAt: new Date('2026-04-20')
  },
  {
    title: 'MLH Fellowship — Spring 2026',
    organization: 'Major League Hacking',
    type: 'place',
    location: 'Remote',
    description: '12-week internship alternative where you contribute to open source projects and learn from industry mentors.',
    skills: ['Programming', 'Open Source', 'Collaboration', 'Git'],
    applyLink: 'https://fellowship.mlh.io/',
    source: 'manual',
    postedAt: new Date('2026-02-01'),
    expiresAt: new Date('2026-04-01')
  },
  {
    title: 'AWS re:Invent Student Program',
    organization: 'Amazon Web Services',
    type: 'place',
    location: 'Las Vegas',
    description: 'Attend AWS re:Invent with a student pass. Networking, sessions, and certifications included.',
    skills: ['Cloud Computing', 'AWS', 'Networking'],
    applyLink: 'https://reinvent.awsevents.com/student',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-11-01')
  },
  {
    title: 'Y Combinator Startup School',
    organization: 'Y Combinator',
    type: 'place',
    location: 'Remote',
    description: 'Free online program for aspiring founders. Mentorship, community, and resources to launch your startup.',
    skills: ['Entrepreneurship', 'Product Development', 'Business Strategy'],
    applyLink: 'https://www.startupschool.org/',
    source: 'manual',
    postedAt: new Date('2026-02-15'),
    expiresAt: new Date('2026-12-31')
  },
  {
    title: 'Microsoft Imagine Cup 2026',
    organization: 'Microsoft',
    type: 'place',
    location: 'Remote',
    description: 'Global technology competition empowering students to use tech to create social impact. Cash prizes and mentorship.',
    skills: ['Azure', 'Programming', 'AI', 'Innovation'],
    applyLink: 'https://imaginecup.microsoft.com/',
    source: 'manual',
    postedAt: new Date('2026-01-20'),
    expiresAt: new Date('2026-07-01')
  },
  {
    title: 'GitHub Externship India',
    organization: 'GitHub',
    type: 'place',
    location: 'Remote',
    description: 'A 3-month externship program for Indian students. Work on real-world open source projects.',
    skills: ['Git', 'Open Source', 'JavaScript', 'Python'],
    applyLink: 'https://externship.github.in/',
    source: 'manual',
    postedAt: new Date('2026-02-20'),
    expiresAt: new Date('2026-05-01')
  },
  {
    title: 'NASSCOM AI Hackathon',
    organization: 'NASSCOM',
    type: 'place',
    location: 'Delhi',
    description: 'National-level AI hackathon for students and professionals. Build AI solutions for real-world challenges.',
    skills: ['AI', 'Machine Learning', 'Python', 'Problem Solving'],
    applyLink: 'https://nasscom.in/ai-hackathon',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-04-30')
  },
  {
    title: 'TechStars Startup Weekend',
    organization: 'TechStars',
    type: 'place',
    location: 'Bangalore',
    description: '54-hour weekend event where developers, designers, and business experts come together to build startups.',
    skills: ['Entrepreneurship', 'Teamwork', 'Pitching', 'Rapid Prototyping'],
    applyLink: 'https://startupweekend.org/',
    source: 'manual',
    postedAt: new Date('2026-03-08'),
    expiresAt: new Date('2026-04-15')
  },
  {
    title: 'IEEE International Conference',
    organization: 'IEEE',
    type: 'place',
    location: 'Hyderabad',
    description: 'Present research papers and attend sessions on cutting-edge technology topics at this international conference.',
    skills: ['Research', 'Technical Writing', 'Networking', 'Technology'],
    applyLink: 'https://ieee.org/conferences',
    source: 'manual',
    postedAt: new Date('2026-02-10'),
    expiresAt: new Date('2026-09-01')
  },
  {
    title: 'IIIT Hackathon — CodeSprint 2026',
    organization: 'IIIT Hyderabad',
    type: 'place',
    location: 'Hyderabad',
    description: '48-hour coding marathon. Build innovative solutions and compete with top engineering talent.',
    skills: ['Programming', 'Problem Solving', 'Teamwork', 'Algorithms'],
    applyLink: 'https://codesprint.iiit.ac.in/',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-04-10')
  },

  // ── Additional mixed records for variety ────────────────────
  {
    title: 'React Native Developer',
    organization: 'MobiStack',
    type: 'job',
    location: 'Remote',
    description: 'Build and maintain mobile apps for iOS and Android using React Native. Strong TypeScript skills needed.',
    skills: ['React Native', 'TypeScript', 'Redux', 'Firebase'],
    applyLink: 'https://mobistack.com/react-native',
    source: 'manual',
    postedAt: new Date('2026-03-09'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Marketing Analytics Intern',
    organization: 'GrowthLoop',
    type: 'internship',
    location: 'Mumbai',
    description: 'Analyze marketing campaign data, build dashboards, and provide actionable insights for growth.',
    skills: ['Google Analytics', 'SQL', 'Excel', 'Data Visualization'],
    applyLink: 'https://growthloop.co/intern',
    source: 'manual',
    postedAt: new Date('2026-03-07'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Open Source Contributor Program',
    organization: 'CNCF',
    type: 'place',
    location: 'Remote',
    description: 'Contribute to Cloud Native Computing Foundation projects. Mentored program for beginners and intermediates.',
    skills: ['Go', 'Kubernetes', 'Open Source', 'Cloud Native'],
    applyLink: 'https://cncf.io/contribute',
    source: 'manual',
    postedAt: new Date('2026-02-25'),
    expiresAt: new Date('2026-06-30')
  },
  {
    title: 'Embedded Systems Engineer',
    organization: 'SiliconBridge',
    type: 'job',
    location: 'Pune',
    description: 'Design and program firmware for IoT devices. Experience with C/C++ and RTOS is essential.',
    skills: ['C', 'C++', 'RTOS', 'IoT', 'Embedded Linux'],
    applyLink: 'https://siliconbridge.in/careers',
    source: 'manual',
    postedAt: new Date('2026-03-04'),
    expiresAt: new Date('2026-05-20')
  },
  {
    title: 'Content Writing Intern',
    organization: 'WriteSphere',
    type: 'internship',
    location: 'Remote',
    description: 'Write blogs, articles, and social media content for B2B tech companies. SEO knowledge is a plus.',
    skills: ['Content Writing', 'SEO', 'Social Media', 'Research'],
    applyLink: 'https://writesphere.com/intern',
    source: 'manual',
    postedAt: new Date('2026-03-06'),
    expiresAt: new Date('2026-05-10')
  },
  {
    title: 'Smart India Hackathon 2026',
    organization: 'Government of India',
    type: 'place',
    location: 'Multiple Cities',
    description: 'National-level hackathon with problem statements from government ministries. Build solutions for India.',
    skills: ['Programming', 'Innovation', 'Problem Solving', 'Teamwork'],
    applyLink: 'https://sih.gov.in/',
    source: 'manual',
    postedAt: new Date('2026-01-10'),
    expiresAt: new Date('2026-08-01')
  },
  {
    title: 'Platform Engineer',
    organization: 'InfraBase',
    type: 'job',
    location: 'Bangalore',
    description: 'Build internal developer platforms, manage cloud infrastructure, and improve developer experience.',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go', 'Platform Engineering'],
    applyLink: 'https://infrabase.io/platform-engineer',
    source: 'manual',
    postedAt: new Date('2026-03-08'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Graphic Design Intern',
    organization: 'CreativeEdge',
    type: 'internship',
    location: 'Delhi',
    description: 'Create visual assets for web, social media, and print. Proficiency in Adobe Creative Suite required.',
    skills: ['Photoshop', 'Illustrator', 'InDesign', 'Canva'],
    applyLink: 'https://creativeedge.co/intern',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'Flutter Developer',
    organization: 'DartWorks',
    type: 'job',
    location: 'Remote',
    description: 'Build beautiful cross-platform apps using Flutter and Dart. State management with Riverpod/Bloc.',
    skills: ['Flutter', 'Dart', 'Firebase', 'Riverpod', 'REST APIs'],
    applyLink: 'https://dartworks.dev/flutter-dev',
    source: 'manual',
    postedAt: new Date('2026-03-09'),
    expiresAt: new Date('2026-06-15')
  },
  {
    title: 'AngelHack Global Hackathon',
    organization: 'AngelHack',
    type: 'place',
    location: 'Remote',
    description: 'Global hackathon series bringing together developers, designers, and entrepreneurs to build amazing products.',
    skills: ['Programming', 'Design', 'Entrepreneurship', 'Rapid Prototyping'],
    applyLink: 'https://angelhack.com/global',
    source: 'manual',
    postedAt: new Date('2026-02-28'),
    expiresAt: new Date('2026-07-01')
  },

  // ── FAANG COMPANIES ─────────────────────────────────────────

  // Meta / Facebook
  {
    title: 'Software Engineer Intern',
    organization: 'Meta',
    type: 'internship',
    location: 'Bangalore',
    description: 'Work on large-scale distributed systems at Meta India. Contribute to products used by billions of users worldwide.',
    skills: ['Python', 'C++', 'React', 'Distributed Systems', 'Data Structures'],
    applyLink: 'https://www.metacareers.com/jobs/',
    source: 'manual',
    postedAt: new Date('2026-02-15'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Production Engineer',
    organization: 'Meta',
    type: 'job',
    location: 'Hyderabad',
    description: 'Ensure reliability and performance of Meta infrastructure. Blend of software engineering and systems engineering.',
    skills: ['Python', 'Linux', 'Networking', 'Distributed Systems', 'Automation'],
    applyLink: 'https://www.metacareers.com/jobs/',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-06-15')
  },
  {
    title: 'Data Scientist — Instagram',
    organization: 'Meta',
    type: 'job',
    location: 'Gurugram',
    description: 'Analyze user behavior, build ML models, and drive product decisions for Instagram at Meta India office.',
    skills: ['Python', 'SQL', 'Machine Learning', 'A/B Testing', 'Statistics'],
    applyLink: 'https://www.metacareers.com/jobs/',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-05-20')
  },
  {
    title: 'Meta University Engineering Intern',
    organization: 'Meta',
    type: 'internship',
    location: 'Remote',
    description: 'A program for first- and second-year students interested in pursuing a career in engineering. Mentored projects at Meta.',
    skills: ['Programming', 'Problem Solving', 'Data Structures', 'Algorithms'],
    applyLink: 'https://www.metacareers.com/jobs/',
    source: 'manual',
    postedAt: new Date('2026-01-20'),
    expiresAt: new Date('2026-04-30')
  },

  // Apple
  {
    title: 'iOS Software Engineer Intern',
    organization: 'Apple',
    type: 'internship',
    location: 'Hyderabad',
    description: 'Build features for iOS and macOS at Apple India Development Center. Work on frameworks used by millions of developers.',
    skills: ['Swift', 'Objective-C', 'UIKit', 'SwiftUI', 'Xcode'],
    applyLink: 'https://jobs.apple.com/',
    source: 'manual',
    postedAt: new Date('2026-02-10'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Machine Learning Engineer — Siri',
    organization: 'Apple',
    type: 'job',
    location: 'Bangalore',
    description: 'Improve Siri natural language understanding and on-device ML models. Work at Apple India ML hub.',
    skills: ['Python', 'PyTorch', 'NLP', 'On-Device ML', 'Swift'],
    applyLink: 'https://jobs.apple.com/',
    source: 'manual',
    postedAt: new Date('2026-03-02'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'Hardware Technology Intern',
    organization: 'Apple',
    type: 'internship',
    location: 'Hyderabad',
    description: 'Work on next-generation Apple silicon and hardware validation at Apple India hardware lab.',
    skills: ['VLSI', 'Verilog', 'Python', 'Signal Processing', 'C++'],
    applyLink: 'https://jobs.apple.com/',
    source: 'manual',
    postedAt: new Date('2026-02-20'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Software Engineer — Maps',
    organization: 'Apple',
    type: 'job',
    location: 'Hyderabad',
    description: 'Build and scale Apple Maps backend services. Work on geospatial data, routing algorithms, and search.',
    skills: ['Java', 'Scala', 'Distributed Systems', 'Geospatial', 'AWS'],
    applyLink: 'https://jobs.apple.com/',
    source: 'manual',
    postedAt: new Date('2026-03-07'),
    expiresAt: new Date('2026-06-20')
  },

  // Netflix
  {
    title: 'Software Engineer — Content Platform',
    organization: 'Netflix',
    type: 'job',
    location: 'Mumbai',
    description: 'Build scalable microservices powering Netflix content delivery and encoding pipelines for the India market.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kafka'],
    applyLink: 'https://jobs.netflix.com/',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Data Engineering Intern',
    organization: 'Netflix',
    type: 'internship',
    location: 'Remote',
    description: 'Build data pipelines and analytics tools that help Netflix understand viewing patterns across 200+ million subscribers.',
    skills: ['Python', 'Apache Spark', 'SQL', 'Airflow', 'AWS'],
    applyLink: 'https://jobs.netflix.com/',
    source: 'manual',
    postedAt: new Date('2026-02-25'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Senior UI Engineer — Studio Tools',
    organization: 'Netflix',
    type: 'job',
    location: 'Remote',
    description: 'Build internal tools for content creators and studio operations. React-based dashboards at Netflix scale.',
    skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'Design Systems'],
    applyLink: 'https://jobs.netflix.com/',
    source: 'manual',
    postedAt: new Date('2026-03-04'),
    expiresAt: new Date('2026-06-10')
  },

  // Google (additional India-specific)
  {
    title: 'Software Engineering Intern — STEP',
    organization: 'Google',
    type: 'internship',
    location: 'Bangalore',
    description: 'Google STEP internship for first/second-year students in India. Work on real Google products with mentorship.',
    skills: ['Data Structures', 'Algorithms', 'Python', 'Java', 'Problem Solving'],
    applyLink: 'https://careers.google.com/',
    source: 'manual',
    postedAt: new Date('2026-01-25'),
    expiresAt: new Date('2026-04-30')
  },
  {
    title: 'Cloud Solutions Architect',
    organization: 'Google',
    type: 'job',
    location: 'Hyderabad',
    description: 'Help enterprise customers design and implement solutions on Google Cloud Platform. Pre-sales and technical leadership.',
    skills: ['GCP', 'Kubernetes', 'Terraform', 'Networking', 'Cloud Architecture'],
    applyLink: 'https://careers.google.com/',
    source: 'manual',
    postedAt: new Date('2026-03-03'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'SDE Intern — YouTube',
    organization: 'Google',
    type: 'internship',
    location: 'Bangalore',
    description: 'Work on YouTube backend systems serving billions of video requests. Optimize search, recommendations, and streaming.',
    skills: ['C++', 'Java', 'Distributed Systems', 'Algorithms', 'Machine Learning'],
    applyLink: 'https://careers.google.com/',
    source: 'manual',
    postedAt: new Date('2026-02-10'),
    expiresAt: new Date('2026-05-20')
  },

  // Amazon (additional India-specific)
  {
    title: 'SDE Intern',
    organization: 'Amazon',
    type: 'internship',
    location: 'Hyderabad',
    description: 'Build and scale services at Amazon India. Work on e-commerce, logistics, or Alexa teams with world-class engineers.',
    skills: ['Java', 'Data Structures', 'Algorithms', 'AWS', 'System Design'],
    applyLink: 'https://www.amazon.jobs/',
    source: 'manual',
    postedAt: new Date('2026-02-05'),
    expiresAt: new Date('2026-05-01')
  },
  {
    title: 'Software Development Engineer II',
    organization: 'Amazon',
    type: 'job',
    location: 'Bangalore',
    description: 'Design and build scalable, high-availability services for Amazon retail and AWS. Ownership-driven culture.',
    skills: ['Java', 'AWS', 'Microservices', 'DynamoDB', 'System Design'],
    applyLink: 'https://www.amazon.jobs/',
    source: 'manual',
    postedAt: new Date('2026-03-06'),
    expiresAt: new Date('2026-06-15')
  },
  {
    title: 'Applied Scientist — Alexa AI',
    organization: 'Amazon',
    type: 'job',
    location: 'Bangalore',
    description: 'Research and develop NLP and speech recognition models for Alexa. Publish papers at top-tier conferences.',
    skills: ['Python', 'NLP', 'Deep Learning', 'PyTorch', 'Speech Recognition'],
    applyLink: 'https://www.amazon.jobs/',
    source: 'manual',
    postedAt: new Date('2026-03-08'),
    expiresAt: new Date('2026-06-30')
  },

  // ── MORE INDIAN JOBS & INTERNSHIPS ──────────────────────────
  {
    title: 'Full-Stack Developer',
    organization: 'Flipkart',
    type: 'job',
    location: 'Bangalore',
    description: 'Build and maintain Flipkart e-commerce platform features. Work on high-traffic systems serving millions of users.',
    skills: ['Java', 'React', 'MySQL', 'Redis', 'Microservices'],
    applyLink: 'https://www.flipkartcareers.com/',
    source: 'manual',
    postedAt: new Date('2026-03-02'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'Backend Engineering Intern',
    organization: 'Razorpay',
    type: 'internship',
    location: 'Bangalore',
    description: 'Build payment infrastructure serving lakhs of businesses. Work on APIs processing crores in transactions daily.',
    skills: ['Go', 'Ruby', 'PostgreSQL', 'Redis', 'REST APIs'],
    applyLink: 'https://razorpay.com/careers/',
    source: 'manual',
    postedAt: new Date('2026-02-28'),
    expiresAt: new Date('2026-05-15')
  },
  {
    title: 'Software Engineer',
    organization: 'Zerodha',
    type: 'job',
    location: 'Bangalore',
    description: 'Build India\'s largest stock broking platform. Work on low-latency trading systems and real-time data pipelines.',
    skills: ['Go', 'Python', 'PostgreSQL', 'Redis', 'WebSockets'],
    applyLink: 'https://zerodha.com/careers/',
    source: 'manual',
    postedAt: new Date('2026-03-04'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'Product Engineering Intern',
    organization: 'CRED',
    type: 'internship',
    location: 'Bangalore',
    description: 'Build fintech products at CRED. Work on rewards, payments, and credit card management features.',
    skills: ['Kotlin', 'Spring Boot', 'React', 'PostgreSQL', 'System Design'],
    applyLink: 'https://careers.cred.club/',
    source: 'manual',
    postedAt: new Date('2026-03-01'),
    expiresAt: new Date('2026-05-20')
  },
  {
    title: 'Data Analyst',
    organization: 'Swiggy',
    type: 'job',
    location: 'Bangalore',
    description: 'Analyze food delivery and quick commerce data. Build dashboards and models to optimize operations.',
    skills: ['Python', 'SQL', 'Tableau', 'Statistics', 'A/B Testing'],
    applyLink: 'https://careers.swiggy.com/',
    source: 'manual',
    postedAt: new Date('2026-03-06'),
    expiresAt: new Date('2026-05-25')
  },
  {
    title: 'SDE Intern',
    organization: 'PhonePe',
    type: 'internship',
    location: 'Pune',
    description: 'Build India\'s leading digital payments app. Work on UPI, mutual funds, and insurance tech.',
    skills: ['Java', 'Spring Boot', 'Kafka', 'MySQL', 'Microservices'],
    applyLink: 'https://www.phonepe.com/careers/',
    source: 'manual',
    postedAt: new Date('2026-02-20'),
    expiresAt: new Date('2026-05-10')
  },
  {
    title: 'Frontend Developer',
    organization: 'Freshworks',
    type: 'job',
    location: 'Chennai',
    description: 'Build SaaS product UIs at Freshworks. Work on CRM, helpdesk, and ITSM tools used by 60,000+ businesses.',
    skills: ['React', 'TypeScript', 'Ember.js', 'CSS', 'Web Components'],
    applyLink: 'https://www.freshworks.com/careers/',
    source: 'manual',
    postedAt: new Date('2026-03-03'),
    expiresAt: new Date('2026-05-30')
  },
  {
    title: 'DevOps Engineer',
    organization: 'Ola',
    type: 'job',
    location: 'Bangalore',
    description: 'Manage cloud infrastructure for Ola ride-hailing and EV platforms. Build CI/CD and monitoring systems.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Python'],
    applyLink: 'https://www.olacabs.com/careers',
    source: 'manual',
    postedAt: new Date('2026-03-05'),
    expiresAt: new Date('2026-06-01')
  },
  {
    title: 'ML Engineering Intern',
    organization: 'Zomato',
    type: 'internship',
    location: 'Gurugram',
    description: 'Build ML models for restaurant recommendations, delivery ETA predictions, and fraud detection at Zomato.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Feature Engineering', 'MLOps'],
    applyLink: 'https://www.zomato.com/careers',
    source: 'manual',
    postedAt: new Date('2026-03-07'),
    expiresAt: new Date('2026-06-15')
  }
];

// ============================================================
// SEED RUNNER
// ============================================================

const seedOpportunities = async () => {
  try {
    await connectDB();
    logger.info('[Seed] Connected to database');

    // Drop the old TTL index on expiresAt if it still exists in Atlas
    // This prevents MongoDB from auto-deleting opportunities
    try {
      const collection = mongoose.connection.collection('opportunities');
      const indexes = await collection.indexes();
      const ttlIndex = indexes.find(idx => idx.key && idx.key.expiresAt && idx.expireAfterSeconds !== undefined);
      if (ttlIndex) {
        await collection.dropIndex(ttlIndex.name);
        logger.info(`[Seed] Dropped old TTL index: ${ttlIndex.name}`);
      } else {
        logger.info('[Seed] No TTL index found — skipping drop');
      }
    } catch (indexErr) {
      logger.warn(`[Seed] Could not drop TTL index: ${indexErr.message}`);
    }

    // Strip expiresAt from all seed records so MongoDB never auto-deletes them
    const cleanedData = sampleOpportunities.map(({ expiresAt, ...rest }) => rest);

    // Clear existing opportunities
    await Opportunity.deleteMany({});
    logger.info('[Seed] Cleared existing opportunities');

    // Insert seed data (without expiresAt — opportunities live forever)
    const inserted = await Opportunity.insertMany(cleanedData, { ordered: false });
    logger.info(`[Seed] Successfully seeded ${inserted.length} opportunities`);

    console.log('\n═══════════════════════════════════════════════════');
    console.log('  OPPORTUNITY SEED COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  Total seeded : ${inserted.length}`);
    console.log(`  Jobs         : ${inserted.filter(o => o.type === 'job').length}`);
    console.log(`  Internships  : ${inserted.filter(o => o.type === 'internship').length}`);
    console.log(`  Places       : ${inserted.filter(o => o.type === 'place').length}`);
    console.log('  Note         : No expiry set — opportunities stay permanently');
    console.log('  Live Jobs    : Run "node agents/fetchAllJobs.js" to pull real jobs');
    console.log('═══════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error('[Seed] Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedOpportunities();
