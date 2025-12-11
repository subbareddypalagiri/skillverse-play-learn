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
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Upcoming Events</h1>
            <p className="text-muted-foreground text-lg">
              Join us for exciting trips, hackathons, and learning experiences
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Event Category</h3>
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 h-auto bg-muted/50 p-2">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    All Events
                  </TabsTrigger>
                  <TabsTrigger value="cultural" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Cultural
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Technical
                  </TabsTrigger>
                  <TabsTrigger value="non-technical" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Non-Technical
                  </TabsTrigger>
                  <TabsTrigger value="fun-tours" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Fun Tours
                  </TabsTrigger>
                  <TabsTrigger value="industrial-tours" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Industrial Tours
                  </TabsTrigger>
                  <TabsTrigger value="hackathons" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Hackathons
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Location Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              <Tabs value={selectedLocation} onValueChange={setSelectedLocation} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-1/2 gap-2 h-auto bg-muted/50 p-2">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    All Locations
                  </TabsTrigger>
                  <TabsTrigger value="In Campus" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    In Campus
                  </TabsTrigger>
                  <TabsTrigger value="Out of Campus" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    Out of Campus
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Events Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-card/50">
                {/* Event Mode Indicator */}
                <div className={`h-2 w-full ${event.mode === 'online' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col gap-2">
                      <Badge variant={getBadgeVariant(event.type)} className="w-fit">
                        {event.type}
                      </Badge>
                      <div className={`flex items-center gap-1 text-xs font-medium ${getModeColor(event.mode)}`}>
                        {getModeIcon(event.mode)}
                        {event.mode === 'online' ? 'Online Event' : 'Offline Event'}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees}/{event.maxAttendees}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-foreground">
                      <Calendar className="w-4 h-4 mr-3 text-primary/70" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-xs text-muted-foreground">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <MapPin className="w-4 h-4 mr-3 text-primary/70" />
                      <div>
                        <div className="font-medium">{event.venue}</div>
                        <div className="text-xs text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <Clock className="w-4 h-4 mr-3 text-primary/70" />
                      <span className="font-medium">{event.duration}</span>
                    </div>
                  </div>
                  
                  {/* Registration Status */}
                  {isRegistered(event) ? (
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Registered</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleRegister(event)}
                      className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-200"
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
      
      {/* Enhanced Success Registration Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-600">Registration Successful! 🎉</h2>
                <p className="text-sm text-muted-foreground mt-1">You're all set for this amazing event!</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            {selectedEvent && (
              <div className="space-y-6">
                {/* Event Summary Card */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border-2 border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-3">{selectedEvent.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <div>
                            <p className="font-semibold">{selectedEvent.date}</p>
                            <p className="text-xs text-muted-foreground">{selectedEvent.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <div>
                            <p className="font-semibold">{selectedEvent.venue}</p>
                            <p className="text-xs text-muted-foreground">{selectedEvent.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="font-semibold">{selectedEvent.duration}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getModeIcon(selectedEvent.mode)}
                          <p className={`font-semibold ${getModeColor(selectedEvent.mode)}`}>
                            {selectedEvent.mode === 'online' ? 'Online Event' : 'Offline Event'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Important Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Organizer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Organization</p>
                        <p className="font-semibold">{selectedEvent.organizer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-semibold text-blue-600">{selectedEvent.contact}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      What to Bring
                    </h4>
                    <p className="text-sm">{selectedEvent.requirements}</p>
                  </Card>
                </div>

                {/* Prizes Section */}
                {selectedEvent.prizes && (
                  <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-2 border-yellow-300">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Prizes & Rewards
                    </h4>
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">{selectedEvent.prizes}</p>
                  </Card>
                )}

                {/* Next Steps */}
                <Card className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What Happens Next?
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>You'll receive a confirmation email at your registered email address within 5 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Event reminder will be sent 24 hours before the event starts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Join link/venue details will be shared 1 hour before the event</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Check your dashboard for all registered events</span>
                    </li>
                  </ul>
                </Card>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={() => setShowSuccessDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Could navigate to dashboard or calendar
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Share functionality
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
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
