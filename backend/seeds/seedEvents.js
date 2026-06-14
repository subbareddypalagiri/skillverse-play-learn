import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for Events Seed');

    let ambassador = await User.findOne({ email: 'ambassador@skillverse.com' });
    if (!ambassador) {
      ambassador = await User.create({
        name: 'Priya Sharma',
        email: 'ambassador@skillverse.com',
        password: 'Password123!',
        role: 'campus_ambassador',
        collegeName: 'SkillVerse Institute of Technology',
        bio: 'Campus Ambassador — Events & Tours'
      });
      logger.info('Created campus ambassador: ambassador@skillverse.com / Password123!');
    }

    let ambassador2 = await User.findOne({ email: 'ambassador2@skillverse.com' });
    if (!ambassador2) {
      ambassador2 = await User.create({
        name: 'Rahul Mehta',
        email: 'ambassador2@skillverse.com',
        password: 'Password123!',
        role: 'campus_ambassador',
        collegeName: 'National College of Engineering',
        bio: 'Campus Ambassador — Cultural & Industrial Events'
      });
    }

    await Event.deleteMany({});
    logger.info('Cleared existing events');

    const events = [
      {
        title: 'Annual Cultural Fest — Rangotsav 2026',
        description: 'Three days of music, dance, drama, and art exhibitions. Open to all students and faculty.',
        eventType: 'cultural',
        category: 'cultural',
        campusLocation: 'In Campus',
        mode: 'offline',
        type: 'Cultural',
        venue: 'Main Auditorium & Open Air Theatre',
        duration: '3 days',
        displayDate: 'Jul 10, 2026',
        displayTime: '10:00 AM',
        location: 'Main Campus',
        startDate: daysFromNow(25),
        endDate: daysFromNow(28),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 800,
        registeredCount: 412,
        createdBy: ambassador._id
      },
      {
        title: 'Full Stack Hackathon 2026',
        description: '48-hour coding marathon. Build a full-stack app, win prizes up to ₹50,000 and internship offers.',
        eventType: 'hackathon',
        category: 'hackathons',
        campusLocation: 'In Campus',
        mode: 'offline',
        type: 'Competition',
        venue: 'Computer Science Block, Lab 3 & 4',
        duration: '48 hours',
        displayDate: 'Jun 28, 2026',
        displayTime: '9:00 AM',
        location: 'CS Block',
        startDate: daysFromNow(14),
        endDate: daysFromNow(16),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 200,
        registeredCount: 156,
        createdBy: ambassador._id
      },
      {
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop covering Python, TensorFlow, and building your first ML model.',
        eventType: 'workshop',
        category: 'technical',
        campusLocation: 'In Campus',
        mode: 'offline',
        type: 'Learning',
        venue: 'AI Research Lab, Building B',
        duration: '4 hours',
        displayDate: 'Jun 20, 2026',
        displayTime: '2:00 PM',
        location: 'Building B',
        startDate: daysFromNow(6),
        endDate: daysFromNow(6),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 120,
        registeredCount: 89,
        createdBy: ambassador._id
      },
      {
        title: 'Leadership & Soft Skills Seminar',
        description: 'Improve communication, teamwork, and interview skills with industry mentors.',
        eventType: 'seminar',
        category: 'non-technical',
        campusLocation: 'In Campus',
        mode: 'offline',
        type: 'Workshop',
        venue: 'Seminar Hall, Admin Block',
        duration: '3 hours',
        displayDate: 'Jul 5, 2026',
        displayTime: '11:00 AM',
        location: 'Admin Block',
        startDate: daysFromNow(20),
        endDate: daysFromNow(20),
        organizerId: ambassador2._id,
        collegeName: ambassador2.collegeName,
        capacity: 150,
        registeredCount: 67,
        createdBy: ambassador2._id
      },
      {
        title: 'Ooty Hill Station Fun Tour',
        description: 'Weekend getaway to Ooty! Tea gardens, boating, botanical gardens, and bonfire night.',
        eventType: 'tour',
        category: 'fun-tours',
        campusLocation: 'Out of Campus',
        mode: 'offline',
        type: 'Adventure',
        venue: 'Departure: Main Campus Gate',
        duration: '2 days 1 night',
        displayDate: 'Jul 18, 2026',
        displayTime: '6:00 AM',
        location: 'Ooty, Tamil Nadu',
        startDate: daysFromNow(33),
        endDate: daysFromNow(34),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 45,
        registeredCount: 38,
        createdBy: ambassador._id,
        tourDetails: {
          destinations: [
            { name: 'Ooty Lake', description: 'Boating and lakeside walk', arrivalTime: '11:00 AM' },
            { name: 'Tea Estate Visit', description: 'Guided tour of tea plantation & factory', arrivalTime: '2:00 PM' },
            { name: 'Botanical Gardens', description: 'Explore 55 acres of exotic plants', arrivalTime: '4:30 PM' },
            { name: 'Doddabetta Peak', description: 'Sunrise viewpoint on Day 2', arrivalTime: '6:30 AM' }
          ],
          food: {
            meals: 'Breakfast (Day 1 & 2), Lunch, Dinner with bonfire BBQ',
            snacks: 'Tea/coffee breaks, packed snacks for travel',
            dietaryOptions: 'Veg & Non-veg options available — inform while registering'
          },
          planner: {
            name: 'Priya Sharma',
            organization: 'SkillVerse Events Committee',
            contact: '+91 98765 43210'
          },
          bus: {
            busNumber: 'KA-01-AB-4521',
            pickupPoint: 'Main Campus Gate, SkillVerse Institute',
            departureTime: '6:00 AM, Jul 18',
            returnTime: '8:00 PM, Jul 19',
            driverName: 'Ramesh Kumar',
            driverContact: '+91 91234 56789',
            capacity: 45
          },
          itinerary: 'Day 1: Depart 6AM → Ooty Lake → Tea Estate → Hotel Check-in → Bonfire Dinner. Day 2: Sunrise at Doddabetta → Botanical Gardens → Depart 4PM → Reach campus 8PM.',
          thingsToCarry: ['ID Card', 'Warm clothes', 'Comfortable shoes', 'Water bottle', 'Personal medicines']
        }
      },
      {
        title: 'Goa Beach & Heritage Tour',
        description: 'Explore beaches, forts, and Goan culture. Perfect end-of-semester trip!',
        eventType: 'tour',
        category: 'fun-tours',
        campusLocation: 'Out of Campus',
        mode: 'offline',
        type: 'Adventure',
        venue: 'Departure: College Bus Stand',
        duration: '3 days 2 nights',
        displayDate: 'Aug 2, 2026',
        displayTime: '5:30 AM',
        location: 'Goa',
        startDate: daysFromNow(48),
        endDate: daysFromNow(50),
        organizerId: ambassador2._id,
        collegeName: ambassador2.collegeName,
        capacity: 40,
        registeredCount: 22,
        createdBy: ambassador2._id,
        tourDetails: {
          destinations: [
            { name: 'Baga Beach', description: 'Water sports and beach games', arrivalTime: '2:00 PM' },
            { name: 'Fort Aguada', description: 'Historic Portuguese fort', arrivalTime: '10:00 AM' },
            { name: 'Old Goa Churches', description: 'UNESCO heritage site tour', arrivalTime: '4:00 PM' }
          ],
          food: {
            meals: 'All meals included — breakfast, lunch, dinner',
            snacks: 'Beach snacks and refreshments',
            dietaryOptions: 'Veg, Jain, and Non-veg menus'
          },
          planner: {
            name: 'Rahul Mehta',
            organization: 'NCE Adventure Club',
            contact: '+91 99887 76655'
          },
          bus: {
            busNumber: 'KA-05-CD-7890',
            pickupPoint: 'NCE Main Bus Stand',
            departureTime: '5:30 AM, Aug 2',
            returnTime: '10:00 PM, Aug 4',
            driverName: 'Suresh Naik',
            driverContact: '+91 87654 32109',
            capacity: 40
          },
          itinerary: 'Day 1: Travel → Baga Beach sunset. Day 2: Fort Aguada → Water sports. Day 3: Old Goa → Return.',
          thingsToCarry: ['Sunscreen', 'Swimwear', 'ID proof', 'Flip flops', 'Cash for souvenirs']
        }
      },
      {
        title: 'TCS & Infosys Industrial Visit',
        description: 'Visit leading IT campuses, meet engineers, understand SDLC, and explore career paths.',
        eventType: 'tour',
        category: 'industrial-tours',
        campusLocation: 'Out of Campus',
        mode: 'offline',
        type: 'Learning',
        venue: 'Departure: Campus Main Gate',
        duration: '1 day',
        displayDate: 'Jun 25, 2026',
        displayTime: '7:00 AM',
        location: 'Electronic City, Bangalore',
        startDate: daysFromNow(11),
        endDate: daysFromNow(11),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 60,
        registeredCount: 54,
        createdBy: ambassador._id,
        tourDetails: {
          destinations: [
            { name: 'TCS Campus — Electronic City', description: 'Campus tour, agile methodology session', arrivalTime: '9:30 AM' },
            { name: 'Infosys Mysore Road Campus', description: 'Innovation lab demo & Q&A with seniors', arrivalTime: '1:30 PM' }
          ],
          food: {
            meals: 'Lunch provided at Infosys cafeteria',
            snacks: 'Morning tea/coffee at TCS',
            dietaryOptions: 'Veg meals — inform dietary needs on registration'
          },
          planner: {
            name: 'Priya Sharma',
            organization: 'SkillVerse Placement Cell',
            contact: '+91 98765 43210'
          },
          bus: {
            busNumber: 'KA-02-EF-3344',
            pickupPoint: 'SkillVerse Main Gate',
            departureTime: '7:00 AM',
            returnTime: '6:00 PM',
            driverName: 'Venkat Reddy',
            driverContact: '+91 90123 45678',
            capacity: 60
          },
          itinerary: '7AM Depart → 9:30AM TCS tour & session → 12:30PM Lunch travel → 1:30PM Infosys visit → 5PM Depart → 6PM Return.',
          thingsToCarry: ['College ID', 'Formal attire', 'Notebook', 'Resume (optional)']
        }
      },
      {
        title: 'Toyota & Bosch Manufacturing Plant Visit',
        description: 'See automotive and engineering manufacturing in action. Learn about Industry 4.0.',
        eventType: 'tour',
        category: 'industrial-tours',
        campusLocation: 'Out of Campus',
        mode: 'offline',
        type: 'Learning',
        venue: 'Departure: NCE Campus',
        duration: '1 day',
        displayDate: 'Jul 12, 2026',
        displayTime: '6:30 AM',
        location: 'Bidadi Industrial Area',
        startDate: daysFromNow(27),
        endDate: daysFromNow(27),
        organizerId: ambassador2._id,
        collegeName: ambassador2.collegeName,
        capacity: 50,
        registeredCount: 41,
        createdBy: ambassador2._id,
        tourDetails: {
          destinations: [
            { name: 'Toyota Kirloskar Plant', description: 'Assembly line tour with safety briefing', arrivalTime: '9:00 AM' },
            { name: 'Bosch Manufacturing Unit', description: 'Robotics & automation demonstration', arrivalTime: '1:00 PM' }
          ],
          food: {
            meals: 'Lunch at industrial canteen',
            snacks: 'Morning refreshments provided',
            dietaryOptions: 'Veg only inside plant premises'
          },
          planner: {
            name: 'Rahul Mehta',
            organization: 'NCE Mechanical Dept.',
            contact: '+91 99887 76655'
          },
          bus: {
            busNumber: 'KA-41-GH-5566',
            pickupPoint: 'NCE Main Campus',
            departureTime: '6:30 AM',
            returnTime: '5:30 PM',
            driverName: 'Gopal Singh',
            driverContact: '+91 78901 23456',
            capacity: 50
          },
          itinerary: '6:30AM Depart → 9AM Toyota plant → 12PM Travel → 1PM Bosch unit → 4PM Return journey.',
          thingsToCarry: ['Safety shoes (mandatory)', 'College ID', 'No photography inside plants']
        }
      },
      {
        title: 'Classical Music Night',
        description: 'An evening of classical Indian music featuring renowned artists from across the country.',
        eventType: 'cultural',
        category: 'cultural',
        campusLocation: 'In Campus',
        mode: 'offline',
        type: 'Social',
        venue: 'Open Air Amphitheatre',
        duration: '3 hours',
        displayDate: 'Jun 22, 2026',
        displayTime: '6:30 PM',
        location: 'Central Campus',
        startDate: daysFromNow(8),
        endDate: daysFromNow(8),
        organizerId: ambassador2._id,
        collegeName: ambassador2.collegeName,
        capacity: 500,
        registeredCount: 287,
        createdBy: ambassador2._id
      },
      {
        title: 'Cloud Architecture Webinar — AWS vs Azure',
        description: 'Live webinar comparing cloud platforms with real deployment demos.',
        eventType: 'webinar',
        category: 'technical',
        campusLocation: 'In Campus',
        mode: 'online',
        type: 'Learning',
        venue: 'Zoom (link sent after registration)',
        duration: '2 hours',
        displayDate: 'Jun 18, 2026',
        displayTime: '4:00 PM',
        location: 'Online',
        isOnline: true,
        eventLink: 'https://zoom.us/j/skillverse-cloud',
        startDate: daysFromNow(4),
        endDate: daysFromNow(4),
        organizerId: ambassador._id,
        collegeName: ambassador.collegeName,
        capacity: 300,
        registeredCount: 198,
        createdBy: ambassador._id
      }
    ];

    const seeded = await Event.create(events);
    logger.info(`Seeded ${seeded.length} events across all categories`);
    logger.info('Ambassador login: ambassador@skillverse.com / Password123!');
    logger.info('Ambassador 2 login: ambassador2@skillverse.com / Password123!');
    process.exit(0);
  } catch (err) {
    logger.error('Events seed failed:', err);
    process.exit(1);
  }
};

seedEvents();
