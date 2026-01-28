import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClubsSection from "@/components/ClubsSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, CheckCircle, Globe, Monitor } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const events = [
    // Cultural Events
    {
      title: "Annual Cultural Fest - Rangmanch",
      date: "Dec 18-20, 2024",
      time: "10:00 AM - 8:00 PM",
      location: "In Campus",
      venue: "Main Auditorium, Campus Center",
      attendees: 450,
      maxAttendees: 500,
      duration: "3 days",
      type: "Competition",
      mode: "offline",
      category: "cultural",
      description: "Three-day cultural extravaganza featuring dance, music, drama, and art competitions. Showcase your talent and win exciting prizes!",
      requirements: "Registration form, Performance props (if any)",
      prizes: "1st Place: $2000, 2nd Place: $1000, 3rd Place: $500 per category",
      organizer: "Cultural Committee",
      contact: "cultural@university.edu"
    },
    {
      title: "Classical Dance Workshop",
      date: "Jan 8, 2025",
      time: "3:00 PM - 6:00 PM",
      location: "In Campus",
      venue: "Dance Studio, Sports Complex",
      attendees: 35,
      maxAttendees: 40,
      duration: "3 hours",
      type: "Workshop",
      mode: "offline",
      category: "cultural",
      description: "Learn classical Indian dance forms from renowned artists. Perfect for beginners and intermediate dancers.",
      requirements: "Comfortable dance attire, Water bottle",
      prizes: "Participation certificate, Performance opportunity",
      organizer: "Dance Society",
      contact: "dance@university.edu"
    },
    {
      title: "Heritage Walk & Museum Tour",
      date: "Jan 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Out of Campus",
      venue: "City Heritage Museum & Old Town",
      attendees: 40,
      maxAttendees: 50,
      duration: "8 hours",
      type: "Learning",
      mode: "offline",
      category: "cultural",
      description: "Explore the rich cultural heritage of our city with guided tours of historical monuments and museums.",
      requirements: "Comfortable walking shoes, Camera, Lunch money",
      prizes: "Cultural appreciation certificate, Photo contest prizes",
      organizer: "Heritage Club",
      contact: "heritage@university.edu"
    },

    // Technical Events
    {
      title: "Winter Coding Hackathon",
      date: "Dec 15-16, 2024",
      time: "9:00 AM - 9:00 PM",
      location: "In Campus",
      venue: "Main Conference Hall, Building A",
      attendees: 150,
      maxAttendees: 200,
      duration: "48 hours",
      type: "Competition",
      mode: "offline",
      category: "technical",
      description: "Join us for an intense 48-hour coding challenge where teams will build innovative solutions to real-world problems. Food and refreshments will be provided.",
      requirements: "Laptop, Programming knowledge, Team of 2-4 members",
      prizes: "1st Place: $5000, 2nd Place: $3000, 3rd Place: $1000",
      organizer: "Tech Society",
      contact: "tech@university.edu"
    },
    {
      title: "AI & ML Tech Talk",
      date: "Dec 22, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "In Campus",
      venue: "Seminar Hall 301, IT Building",
      attendees: 180,
      maxAttendees: 200,
      duration: "2 hours",
      type: "Learning",
      mode: "offline",
      category: "technical",
      description: "Learn about latest trends in AI from industry experts. Interactive Q&A session included.",
      requirements: "Notebook for notes",
      prizes: "Certificate of participation, Networking opportunities",
      organizer: "AI Research Center",
      contact: "ai@university.edu"
    },
    {
      title: "Web Dev Workshop",
      date: "Jan 5, 2025",
      time: "10:00 AM - 2:00 PM",
      location: "In Campus",
      venue: "Computer Lab 204, Main Building, Floor 2",
      attendees: 80,
      maxAttendees: 100,
      duration: "4 hours",
      type: "Workshop",
      mode: "offline",
      category: "technical",
      description: "Hands-on workshop on modern web development covering React, Node.js, and database integration.",
      requirements: "Laptop, Basic programming knowledge",
      prizes: "Workshop completion certificate, Project portfolio",
      organizer: "Web Development Society",
      contact: "webdev@university.edu"
    },
    {
      title: "Robotics Competition",
      date: "Jan 20, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "In Campus",
      venue: "Engineering Lab, Block C",
      attendees: 60,
      maxAttendees: 80,
      duration: "8 hours",
      type: "Competition",
      mode: "offline",
      category: "technical",
      description: "Build and program robots to complete challenging tasks. Team-based competition with exciting prizes.",
      requirements: "Robot kit, Programming tools, Team of 3-5",
      prizes: "1st: $3000, 2nd: $2000, 3rd: $1000",
      organizer: "Robotics Club",
      contact: "robotics@university.edu"
    },

    // Non-Technical Events
    {
      title: "Photography Exhibition & Contest",
      date: "Dec 28, 2024",
      time: "11:00 AM - 6:00 PM",
      location: "In Campus",
      venue: "Art Gallery, Student Center",
      attendees: 90,
      maxAttendees: 120,
      duration: "7 hours",
      type: "Competition",
      mode: "offline",
      category: "non-technical",
      description: "Showcase your photography skills! Submit your best shots and compete with fellow photographers.",
      requirements: "Camera, Printed photos (5 max), Digital submissions",
      prizes: "1st: Professional camera, 2nd: Photography course, 3rd: Gift vouchers",
      organizer: "Photography Club",
      contact: "photo@university.edu"
    },
    {
      title: "Creative Writing Workshop",
      date: "Jan 10, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "In Campus",
      venue: "Library Reading Room",
      attendees: 45,
      maxAttendees: 50,
      duration: "3 hours",
      type: "Workshop",
      mode: "offline",
      category: "non-technical",
      description: "Learn the art of storytelling from published authors. Interactive sessions on fiction, poetry, and creative non-fiction.",
      requirements: "Notebook, Pen, Sample writing (optional)",
      prizes: "Certificate, Publication opportunity in college magazine",
      organizer: "Literary Society",
      contact: "literary@university.edu"
    },
    {
      title: "Debate Championship",
      date: "Jan 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "In Campus",
      venue: "Debate Hall, Academic Block",
      attendees: 70,
      maxAttendees: 100,
      duration: "6 hours",
      type: "Competition",
      mode: "offline",
      category: "non-technical",
      description: "Inter-college debate competition on contemporary issues. Sharpen your oratory and critical thinking skills.",
      requirements: "Research on topics, Team of 2-3",
      prizes: "1st: $1500, 2nd: $1000, 3rd: $500, Best Speaker award",
      organizer: "Debate Society",
      contact: "debate@university.edu"
    },

    // Fun Tours
    {
      title: "Mountain Adventure Trek",
      date: "Dec 20-22, 2024",
      time: "6:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Blue Mountains National Park",
      attendees: 45,
      maxAttendees: 50,
      duration: "3 days",
      type: "Adventure",
      mode: "offline",
      category: "fun-tours",
      description: "Experience nature while bonding with fellow students. This 3-day trek includes camping, hiking, and team-building activities.",
      requirements: "Hiking boots, Warm clothing, Sleeping bag",
      prizes: "Certificate of completion, Group photo, Adventure badge",
      organizer: "Adventure Club",
      contact: "adventure@university.edu"
    },
    {
      title: "Beach Cleanup & Picnic",
      date: "Jan 12, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Sunset Beach Park, Pavilion Area",
      attendees: 60,
      maxAttendees: 80,
      duration: "1 day",
      type: "Social",
      mode: "offline",
      category: "fun-tours",
      description: "Make a difference while having fun at the beach. Environmental cleanup followed by picnic and games.",
      requirements: "Comfortable clothes, Sunscreen, Water bottle",
      prizes: "Environmental volunteer certificate, Group lunch",
      organizer: "Environmental Club",
      contact: "environment@university.edu"
    },
    {
      title: "Amusement Park Day Trip",
      date: "Jan 28, 2025",
      time: "8:00 AM - 8:00 PM",
      location: "Out of Campus",
      venue: "WonderWorld Amusement Park",
      attendees: 120,
      maxAttendees: 150,
      duration: "12 hours",
      type: "Social",
      mode: "offline",
      category: "fun-tours",
      description: "A day of unlimited fun with rides, games, and entertainment. Perfect stress-buster before exams!",
      requirements: "Comfortable clothes, Extra money for food/games",
      prizes: "Group photos, Fun memories",
      organizer: "Student Activities Committee",
      contact: "activities@university.edu"
    },

    // Industrial Tours
    {
      title: "Tech Company Visit - Google Office",
      date: "Jan 16, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Out of Campus",
      venue: "Google India Office, Tech Park",
      attendees: 40,
      maxAttendees: 50,
      duration: "7 hours",
      type: "Learning",
      mode: "offline",
      category: "industrial-tours",
      description: "Visit Google's office, interact with engineers, learn about their work culture and technologies. Networking opportunity with industry professionals.",
      requirements: "College ID, Formal attire, Resume (optional)",
      prizes: "Certificate of visit, Networking opportunities, Goodies",
      organizer: "Industry Relations Cell",
      contact: "industry@university.edu"
    },
    {
      title: "Manufacturing Plant Tour - AutoTech",
      date: "Feb 2, 2025",
      time: "8:00 AM - 5:00 PM",
      location: "Out of Campus",
      venue: "AutoTech Manufacturing Facility, Industrial Area",
      attendees: 55,
      maxAttendees: 60,
      duration: "9 hours",
      type: "Learning",
      mode: "offline",
      category: "industrial-tours",
      description: "Explore automobile manufacturing processes, robotics, and quality control systems. Ideal for engineering students.",
      requirements: "Safety shoes, College ID, Notebook",
      prizes: "Industrial visit certificate, Internship opportunities",
      organizer: "Mechanical Engineering Dept",
      contact: "mech@university.edu"
    },
    {
      title: "Startup Incubator Visit",
      date: "Feb 8, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Out of Campus",
      venue: "Innovation Hub, Startup District",
      attendees: 35,
      maxAttendees: 40,
      duration: "5 hours",
      type: "Learning",
      mode: "offline",
      category: "industrial-tours",
      description: "Meet startup founders, learn about entrepreneurship, and understand the startup ecosystem. Pitch your ideas!",
      requirements: "Business casual attire, Notebook, Business idea (optional)",
      prizes: "Mentorship opportunities, Networking, Certificate",
      organizer: "Entrepreneurship Cell",
      contact: "ecell@university.edu"
    },

    // Hackathons
    {
      title: "24-Hour Code Sprint",
      date: "Feb 14-15, 2025",
      time: "12:00 PM - 12:00 PM",
      location: "In Campus",
      venue: "Innovation Lab, IT Building",
      attendees: 100,
      maxAttendees: 120,
      duration: "24 hours",
      type: "Competition",
      mode: "offline",
      category: "hackathons",
      description: "Non-stop 24-hour coding marathon! Build innovative apps, solve real-world problems, and win amazing prizes.",
      requirements: "Laptop, Charger, Team of 2-4, Programming skills",
      prizes: "1st: $4000, 2nd: $2500, 3rd: $1500, Swag for all",
      organizer: "Coding Club",
      contact: "coding@university.edu"
    },
    {
      title: "AI/ML Hackathon",
      date: "Feb 22-23, 2025",
      time: "10:00 AM - 10:00 AM",
      location: "In Campus",
      venue: "Data Science Lab, Block D",
      attendees: 80,
      maxAttendees: 100,
      duration: "24 hours",
      type: "Competition",
      mode: "offline",
      category: "hackathons",
      description: "Focus on AI and Machine Learning projects. Build intelligent systems, work with datasets, and create ML models.",
      requirements: "Laptop with ML libraries, Team of 2-4, Dataset knowledge",
      prizes: "1st: $5000 + Cloud credits, 2nd: $3000, 3rd: $1500",
      organizer: "AI/ML Club",
      contact: "aiml@university.edu"
    },
    {
      title: "Social Impact Hackathon",
      date: "Mar 1-2, 2025",
      time: "9:00 AM - 9:00 AM",
      location: "In Campus",
      venue: "Community Center, Campus",
      attendees: 90,
      maxAttendees: 120,
      duration: "24 hours",
      type: "Competition",
      mode: "offline",
      category: "hackathons",
      description: "Create technology solutions for social good. Address problems in education, healthcare, environment, and community development.",
      requirements: "Laptop, Team of 3-5, Passion for social change",
      prizes: "1st: $6000 + Incubation support, 2nd: $3500, 3rd: $2000",
      organizer: "Social Innovation Lab",
      contact: "social@university.edu"
    },

    // Additional Out of Campus Events
    {
      title: "TEDx Youth Conference",
      date: "Dec 10, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Grand Convention Center, Downtown",
      attendees: 280,
      maxAttendees: 300,
      duration: "9 hours",
      type: "Learning",
      mode: "offline",
      category: "non-technical",
      description: "Attend inspiring talks from young innovators, entrepreneurs, and change-makers. Network with like-minded individuals and get inspired by ideas worth spreading.",
      requirements: "Conference ticket, Notebook, Business cards (optional)",
      prizes: "Certificate of attendance, Networking opportunities, Speaker meet & greet",
      organizer: "TEDx Youth Committee",
      contact: "tedx@university.edu"
    },
    {
      title: "National Science Exhibition",
      date: "Jan 18-19, 2025",
      time: "10:00 AM - 7:00 PM",
      location: "Out of Campus",
      venue: "National Science Museum & Exhibition Center",
      attendees: 150,
      maxAttendees: 200,
      duration: "2 days",
      type: "Learning",
      mode: "offline",
      category: "technical",
      description: "Explore cutting-edge scientific innovations, interactive exhibits, and demonstrations. Showcase your own projects and compete for national recognition.",
      requirements: "Project model (if participating), College ID, Comfortable shoes",
      prizes: "Best Project: $8000, Runner-up: $5000, Innovation Award: $3000",
      organizer: "Science & Technology Dept",
      contact: "science@university.edu"
    },
    {
      title: "Music Festival - Euphoria Live",
      date: "Feb 14, 2025",
      time: "5:00 PM - 11:00 PM",
      location: "Out of Campus",
      venue: "City Stadium, Main Arena",
      attendees: 450,
      maxAttendees: 500,
      duration: "6 hours",
      type: "Social",
      mode: "offline",
      category: "cultural",
      description: "Live performances by popular bands and artists. Enjoy an evening of music, dance, and entertainment with fellow students.",
      requirements: "Event ticket, Valid ID, No outside food/drinks",
      prizes: "Concert experience, Exclusive merchandise, Meet & greet passes (lucky draw)",
      organizer: "Music Society",
      contact: "music@university.edu"
    },
    {
      title: "Historical Fort Trek & Camping",
      date: "Feb 20-21, 2025",
      time: "6:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Rajgad Fort, Western Ghats",
      attendees: 55,
      maxAttendees: 60,
      duration: "2 days",
      type: "Adventure",
      mode: "offline",
      category: "fun-tours",
      description: "Trek to the historic Rajgad Fort, camp under the stars, and learn about Maratha history. Includes guided tour, bonfire, and adventure activities.",
      requirements: "Trekking shoes, Backpack, Sleeping bag, Water bottle, Torch",
      prizes: "Trekking certificate, Group photos, Adventure badge",
      organizer: "Trekking & Adventure Club",
      contact: "trek@university.edu"
    },
    {
      title: "Pharmaceutical Industry Visit - Cipla",
      date: "Mar 5, 2025",
      time: "8:30 AM - 4:30 PM",
      location: "Out of Campus",
      venue: "Cipla Pharmaceutical Plant, Industrial Estate",
      attendees: 45,
      maxAttendees: 50,
      duration: "8 hours",
      type: "Learning",
      mode: "offline",
      category: "industrial-tours",
      description: "Tour one of India's leading pharmaceutical manufacturing facilities. Learn about drug development, quality control, and pharmaceutical industry practices.",
      requirements: "Lab coat, Safety shoes, College ID, Medical clearance certificate",
      prizes: "Industrial visit certificate, Internship opportunities, Company goodies",
      organizer: "Pharmacy Department",
      contact: "pharmacy@university.edu"
    },
    {
      title: "Wildlife Safari & Conservation Workshop",
      date: "Mar 15-17, 2025",
      time: "5:00 AM - 7:00 PM",
      location: "Out of Campus",
      venue: "Tadoba National Park & Wildlife Sanctuary",
      attendees: 35,
      maxAttendees: 40,
      duration: "3 days",
      type: "Learning",
      mode: "offline",
      category: "fun-tours",
      description: "Experience wildlife in their natural habitat with guided safaris. Attend workshops on wildlife conservation, photography, and ecosystem management.",
      requirements: "Binoculars, Camera, Khaki/green clothing, Sunscreen, Hat",
      prizes: "Wildlife photography contest prizes, Conservation certificate, Safari experience",
      organizer: "Environmental Science Club",
      contact: "wildlife@university.edu"
    },
    {
      title: "International Food Festival",
      date: "Mar 22, 2025",
      time: "11:00 AM - 9:00 PM",
      location: "Out of Campus",
      venue: "City Food Park & Cultural Plaza",
      attendees: 200,
      maxAttendees: 250,
      duration: "10 hours",
      type: "Social",
      mode: "offline",
      category: "cultural",
      description: "Explore cuisines from around the world, participate in cooking competitions, and enjoy cultural performances. A celebration of global diversity through food.",
      requirements: "Event pass, Appetite for adventure, Camera",
      prizes: "Cooking competition prizes, Food vouchers, Cultural exchange certificates",
      organizer: "International Students Association",
      contact: "international@university.edu"
    },
    {
      title: "Aerospace & Defense Expo Visit",
      date: "Apr 2, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Out of Campus",
      venue: "Aero India Exhibition Grounds, Bangalore",
      attendees: 65,
      maxAttendees: 80,
      duration: "8 hours",
      type: "Learning",
      mode: "offline",
      category: "industrial-tours",
      description: "Visit Asia's premier aerospace exhibition featuring aircraft displays, defense technology, and space exploration innovations. Meet industry experts and explore career opportunities.",
      requirements: "Government ID, Formal attire, Resume, Comfortable walking shoes",
      prizes: "Expo certificate, Industry networking, Internship opportunities",
      organizer: "Aerospace Engineering Society",
      contact: "aerospace@university.edu"
    },
    {
      title: "River Rafting Adventure",
      date: "Apr 10-11, 2025",
      time: "6:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Kundalika River, Kolad",
      attendees: 40,
      maxAttendees: 48,
      duration: "2 days",
      type: "Adventure",
      mode: "offline",
      category: "fun-tours",
      description: "Experience the thrill of white water rafting in the scenic Kundalika River. Includes safety training, professional guides, camping, and team activities.",
      requirements: "Swimwear, Extra clothes, Waterproof bag, Adventure spirit",
      prizes: "Rafting certificate, GoPro footage, Adventure completion badge",
      organizer: "Water Sports Club",
      contact: "watersports@university.edu"
    },
    {
      title: "Blockchain & Crypto Summit",
      date: "Apr 18, 2025",
      time: "10:00 AM - 6:00 PM",
      location: "Out of Campus",
      venue: "Tech Innovation Hub, Cyber City",
      attendees: 120,
      maxAttendees: 150,
      duration: "8 hours",
      type: "Learning",
      mode: "offline",
      category: "technical",
      description: "Learn about blockchain technology, cryptocurrency, Web3, and decentralized applications from industry leaders. Includes hands-on workshops and networking sessions.",
      requirements: "Laptop, Basic understanding of blockchain (optional), Notebook",
      prizes: "Summit certificate, Crypto wallet credits, Internship opportunities",
      organizer: "Blockchain Research Group",
      contact: "blockchain@university.edu"
    }
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Competition": return "default";
      case "Adventure": return "secondary";
      case "Learning": return "outline";
      case "Workshop": return "secondary";
      case "Social": return "outline";
      default: return "outline";
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === "online" ? <Globe className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
  };

  const getModeColor = (mode: string) => {
    return mode === "online" ? "text-blue-500" : "text-green-500";
  };

  const handleRegister = (event: any) => {
    setSelectedEvent(event);
    setRegisteredEvents(prev => [...prev, event]);
    setShowSuccessDialog(true); // Show success dialog
  };

  const isRegistered = (event: any) => {
    return registeredEvents.some(registered => registered.title === event.title);
  };

  // Filter events based on selected category and location
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
    const locationMatch = selectedLocation === "all" || event.location === selectedLocation;
    return categoryMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out forwards' }}>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Events</h1>
            <p className="text-muted-foreground">
              Discover and join exciting events, hackathons, and learning experiences
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-6 space-y-4" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 50ms forwards' }}>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'cultural', label: 'Cultural' },
                { value: 'technical', label: 'Technical' },
                { value: 'non-technical', label: 'Non-Technical' },
                { value: 'fun-tours', label: 'Fun Tours' },
                { value: 'industrial-tours', label: 'Industrial Tours' },
                { value: 'hackathons', label: 'Hackathons' },
              ].map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Location:</span>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'In Campus', label: 'In Campus' },
                  { value: 'Out of Campus', label: 'Out of Campus' },
                ].map((location) => (
                  <button
                    key={location.value}
                    onClick={() => setSelectedLocation(location.value)}
                    className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                      selectedLocation === location.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Count */}
          <div className="mb-4" style={{ opacity: 0, animation: 'fadeInUp 0.5s ease-out 100ms forwards' }}>
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
              <Card 
                key={index} 
                className="overflow-hidden bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                style={{ opacity: 0, animation: `fadeInUp 0.5s ease-out ${150 + index * 40}ms forwards` }}
              >
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {event.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        event.mode === 'online' 
                          ? 'bg-primary/5 text-primary' 
                          : 'bg-primary/5 text-primary'
                      }`}>
                        {event.mode === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}/{event.maxAttendees}</span>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-base font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Calendar className="w-3 h-3 text-primary" />
                      </div>
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <MapPin className="w-3 h-3 text-primary" />
                      </div>
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Clock className="w-3 h-3 text-primary" />
                      </div>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  
                  {/* Registration Button */}
                  {isRegistered(event) ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-primary/10 rounded-lg text-primary">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event)}
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs h-8"
                    >
                      Register Now
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          {/* Clubs Section - Interactive Community System */}
          <ClubsSection />
        </div>
      </div>
      
      {/* Success Registration Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Registration Successful</h2>
                <p className="text-sm text-muted-foreground mt-1">You're all set for this event</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {selectedEvent && (
              <div className="space-y-4">
                {/* Event Summary */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-sm mb-3">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.date} · {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedEvent.duration}</span>
                    </div>
                  </div>
                </Card>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Organizer</p>
                    <p className="text-xs font-medium">{selectedEvent.organizer}</p>
                  </Card>
                  <Card className="p-3 border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Mode</p>
                    <p className="text-xs font-medium">{selectedEvent.mode === 'online' ? 'Online' : 'Offline'}</p>
                  </Card>
                </div>

                {/* What's Next */}
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p className="font-medium text-foreground">What happens next:</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Confirmation email sent to your inbox</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reminder 24 hours before the event</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                variant="outline"
                size="sm"
                className="flex-1 border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                Close
              </Button>
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Events;
