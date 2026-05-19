import mongoose from 'mongoose';
import AlumniTalk from '../models/AlumniTalk.js';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';
import 'dotenv/config';

const seedSyncData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillverse');
    console.log('✅ MongoDB connected for seeding');

    // Clear existing data
    await AlumniTalk.deleteMany({});
    await Mentor.deleteMany({});
    console.log('🗑️  Cleared existing sync data');

    // Create sample alumni talks
    const alumniTalks = [
      {
        domain: 'ai',
        speaker: {
          name: 'Priya Nair',
          role: 'Senior ML Engineer',
          company: 'OpenAI',
          avatar: 'https://i.pravatar.cc/150?img=47',
          bio: 'Building the future of AI with LLMs and neural networks',
          linkedIn: 'https://linkedin.com/in/priyanair'
        },
        topic: 'Practical LLM Finetuning in Production',
        description: 'Learn how to effectively fine-tune large language models for production use cases. We\'ll cover data preparation, training strategies, evaluation metrics, and deployment best practices.',
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 90,
        maxAttendees: 500,
        tags: ['AI', 'LLM', 'Machine Learning', 'Production'],
        status: 'upcoming',
        meetingLink: 'https://meet.example.com/llm-finetuning'
      },
      {
        domain: 'web',
        speaker: {
          name: 'Aman Verma',
          role: 'Staff Frontend Engineer',
          company: 'Stripe',
          avatar: 'https://i.pravatar.cc/150?img=12',
          bio: 'Passionate about creating scalable design systems and delightful user experiences',
          linkedIn: 'https://linkedin.com/in/amanverma'
        },
        topic: 'Design Systems that Scale',
        description: 'Discover how to build and maintain design systems that grow with your organization. Topics include component architecture, theming, documentation, and governance.',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 75,
        maxAttendees: 300,
        tags: ['Web Development', 'Design Systems', 'Frontend', 'React'],
        status: 'upcoming',
        meetingLink: 'https://meet.example.com/design-systems'
      },
      {
        domain: 'cloud',
        speaker: {
          name: 'Zara Sheikh',
          role: 'SRE Lead',
          company: 'Google',
          avatar: 'https://i.pravatar.cc/150?img=5',
          bio: 'Building reliable and resilient systems at scale',
          linkedIn: 'https://linkedin.com/in/zarasheikh'
        },
        topic: 'Resilience Engineering 101',
        description: 'Understanding chaos engineering, failure modes, incident response, and building systems that gracefully handle failures. Real-world examples from Google\'s infrastructure.',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 60,
        maxAttendees: 400,
        tags: ['DevOps', 'SRE', 'Cloud', 'Reliability'],
        status: 'upcoming',
        meetingLink: 'https://meet.example.com/resilience-eng'
      },
      {
        domain: 'data',
        speaker: {
          name: 'Rahul Sharma',
          role: 'Data Science Manager',
          company: 'Netflix',
          avatar: 'https://i.pravatar.cc/150?img=33',
          bio: 'Leveraging data to improve content recommendations',
          linkedIn: 'https://linkedin.com/in/rahulsharma'
        },
        topic: 'Building Recommendation Systems',
        description: 'Deep dive into how Netflix builds and scales recommendation systems. Learn about collaborative filtering, content-based recommendations, and hybrid approaches.',
        scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        duration: 80,
        maxAttendees: 350,
        tags: ['Data Science', 'ML', 'Recommendations', 'Python'],
        status: 'upcoming'
      },
      {
        domain: 'mobile',
        speaker: {
          name: 'Sneha Patel',
          role: 'Lead iOS Engineer',
          company: 'Apple',
          avatar: 'https://i.pravatar.cc/150?img=31',
          bio: 'Crafting delightful mobile experiences',
          linkedIn: 'https://linkedin.com/in/snehapatel'
        },
        topic: 'Modern iOS Development with SwiftUI',
        description: 'Learn SwiftUI best practices, state management, and performance optimization for building production-ready iOS applications.',
        scheduledAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        duration: 70,
        maxAttendees: 250,
        tags: ['iOS', 'SwiftUI', 'Mobile', 'Swift'],
        status: 'upcoming'
      },
      {
        domain: 'design',
        speaker: {
          name: 'Maya Johnson',
          role: 'Principal Product Designer',
          company: 'Airbnb',
          avatar: 'https://i.pravatar.cc/150?img=25',
          bio: 'Creating intuitive and beautiful user experiences',
          linkedIn: 'https://linkedin.com/in/mayajohnson'
        },
        topic: 'User Research in Agile Teams',
        description: 'How to integrate continuous user research into fast-paced agile development. Methods, tools, and practical tips from Airbnb\'s design process.',
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        duration: 65,
        maxAttendees: 200,
        tags: ['UX', 'Design', 'Research', 'Agile'],
        status: 'upcoming'
      }
    ];

    const createdTalks = await AlumniTalk.insertMany(alumniTalks);
    console.log(`✅ Created ${createdTalks.length} alumni talks`);

    // Get some users to be mentors (or create sample users)
    let mentorUsers = await User.find().limit(6);
    
    if (mentorUsers.length < 6) {
      console.log('⚠️  Not enough users found. Creating sample mentor users...');
      
      // Create sample users for mentors
      const sampleUsers = [
        {
          name: 'Rohan Das',
          email: 'rohan.das@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=33',
          role: 'student',
          isVerified: true
        },
        {
          name: 'Sara Lee',
          email: 'sara.lee@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=21',
          role: 'student',
          isVerified: true
        },
        {
          name: 'Kabir Singh',
          email: 'kabir.singh@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=14',
          role: 'student',
          isVerified: true
        },
        {
          name: 'Ananya Rao',
          email: 'ananya.rao@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=55',
          role: 'student',
          isVerified: true
        },
        {
          name: 'Dev Patel',
          email: 'dev.patel@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=45',
          role: 'student',
          isVerified: true
        },
        {
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          password: '$2a$10$rOvRoi9CCoz7ydpFubOrReV94VvZAasMbf.5uru5B6SLhDY2eACG.',
          avatar: 'https://i.pravatar.cc/150?img=29',
          role: 'student',
          isVerified: true
        }
      ];

      try {
        mentorUsers = await User.insertMany(sampleUsers);
        console.log(`✅ Created ${mentorUsers.length} sample users for mentors`);
      } catch (error) {
        console.log('⚠️  Some users might already exist, trying to find existing ones...');
        mentorUsers = await User.find({ 
          email: { $in: sampleUsers.map(u => u.email) } 
        }).limit(6);
      }
    }

    if (mentorUsers.length >= 6) {
      const mentors = [
        {
          user: mentorUsers[0]._id,
          domain: 'ai',
          role: 'ML Mentor',
          company: 'Google AI',
          expertise: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP'],
          bio: 'Helping aspiring ML engineers navigate their career journey with 8+ years of industry experience.',
          yearsOfExperience: 8,
          services: [
            { type: 'Mock Interview', duration: 60, price: 50 },
            { type: 'Resume Review', duration: 30, price: 25 },
            { type: 'Career Guidance', duration: 45, price: 40 },
            { type: 'Roadmap Planning', duration: 60, price: 45 }
          ],
          availability: [
            {
              day: 'Saturday',
              slots: [
                { startTime: '09:00', endTime: '10:00', isBooked: false },
                { startTime: '10:00', endTime: '11:00', isBooked: false },
                { startTime: '14:00', endTime: '15:00', isBooked: false }
              ]
            },
            {
              day: 'Sunday',
              slots: [
                { startTime: '10:00', endTime: '11:00', isBooked: false },
                { startTime: '15:00', endTime: '16:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 4.9, count: 320 },
          totalSessions: 320,
          languages: ['English', 'Hindi'],
          socialLinks: {
            linkedIn: 'https://linkedin.com/in/mentor1',
            github: 'https://github.com/mentor1'
          }
        },
        {
          user: mentorUsers[1]._id,
          domain: 'web',
          role: 'Frontend Mentor',
          company: 'Meta',
          expertise: ['React', 'TypeScript', 'Next.js', 'CSS', 'Performance'],
          bio: 'Passionate about helping developers build modern, performant web applications.',
          yearsOfExperience: 6,
          services: [
            { type: 'Mock Interview', duration: 60, price: 45 },
            { type: 'Resume Review', duration: 30, price: 20 },
            { type: 'Project Review', duration: 45, price: 35 }
          ],
          availability: [
            {
              day: 'Friday',
              slots: [
                { startTime: '18:00', endTime: '19:00', isBooked: false },
                { startTime: '19:00', endTime: '20:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 4.8, count: 270 },
          totalSessions: 270,
          languages: ['English']
        },
        {
          user: mentorUsers[2]._id,
          domain: 'data',
          role: 'Data Mentor',
          company: 'Amazon',
          expertise: ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Pandas'],
          bio: 'Data scientist with a passion for teaching and mentoring the next generation.',
          yearsOfExperience: 5,
          services: [
            { type: 'Career Guidance', duration: 45, price: 35 },
            { type: 'Roadmap Planning', duration: 60, price: 40 },
            { type: 'Skill Assessment', duration: 30, price: 25 }
          ],
          availability: [
            {
              day: 'Saturday',
              slots: [
                { startTime: '11:00', endTime: '12:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 4.7, count: 190 },
          totalSessions: 190,
          languages: ['English', 'Spanish']
        },
        {
          user: mentorUsers[3]._id,
          domain: 'cloud',
          role: 'DevOps Mentor',
          company: 'Microsoft Azure',
          expertise: ['AWS', 'Azure', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
          bio: 'Helping engineers master cloud infrastructure and DevOps practices.',
          yearsOfExperience: 10,
          services: [
            { type: 'Mock Interview', duration: 60, price: 60 },
            { type: 'Resume Review', duration: 30, price: 30 },
            { type: 'Career Guidance', duration: 45, price: 50 }
          ],
          availability: [
            {
              day: 'Sunday',
              slots: [
                { startTime: '09:00', endTime: '10:00', isBooked: false },
                { startTime: '10:00', endTime: '11:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 5.0, count: 410 },
          totalSessions: 410,
          languages: ['English']
        },
        {
          user: mentorUsers[4]._id,
          domain: 'mobile',
          role: 'Mobile Mentor',
          company: 'Uber',
          expertise: ['React Native', 'iOS', 'Android', 'Flutter', 'Mobile Architecture'],
          bio: 'Mobile development expert with experience in building apps for millions of users.',
          yearsOfExperience: 7,
          services: [
            { type: 'Mock Interview', duration: 60, price: 50 },
            { type: 'Project Review', duration: 45, price: 40 }
          ],
          availability: [
            {
              day: 'Saturday',
              slots: [
                { startTime: '16:00', endTime: '17:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 4.6, count: 150 },
          totalSessions: 150,
          languages: ['English', 'French']
        },
        {
          user: mentorUsers[5]._id,
          domain: 'design',
          role: 'UX Mentor',
          company: 'Adobe',
          expertise: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Thinking'],
          bio: 'Helping designers create impactful and user-centered experiences.',
          yearsOfExperience: 9,
          services: [
            { type: 'Resume Review', duration: 30, price: 25 },
            { type: 'Career Guidance', duration: 45, price: 40 },
            { type: 'Project Review', duration: 60, price: 50 }
          ],
          availability: [
            {
              day: 'Friday',
              slots: [
                { startTime: '17:00', endTime: '18:00', isBooked: false }
              ]
            }
          ],
          rating: { average: 4.9, count: 220 },
          totalSessions: 220,
          languages: ['English', 'German']
        }
      ];

      const createdMentors = await Mentor.insertMany(mentors);
      console.log(`✅ Created ${createdMentors.length} mentors`);
    }

    console.log('🎉 Sync data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding sync data:', error);
    process.exit(1);
  }
};

seedSyncData();
