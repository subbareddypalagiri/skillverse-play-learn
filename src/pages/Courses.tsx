import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Clock, Users, Star, CheckCircle, Play } from "lucide-react";
import { useState } from "react";
import CourseDashboard from "../components/CourseDashboard";
import { useCourseContext } from "../contexts/CourseContext";

const Courses = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { enrolledCourses, addCourse } = useCourseContext();

  const courses = [
    {
      title: "Web Development Masterclass",
      instructor: "John Doe",
      duration: "12 weeks",
      students: 2345,
      rating: 4.8,
      level: "Beginner",
      category: "Development"
    },
    {
      title: "Data Structures & Algorithms",
      instructor: "Jane Smith",
      duration: "10 weeks",
      students: 1890,
      rating: 4.9,
      level: "Intermediate",
      category: "Computer Science"
    },
    {
      title: "UI/UX Design Fundamentals",
      instructor: "Mike Johnson",
      duration: "8 weeks",
      students: 3421,
      rating: 4.7,
      level: "Beginner",
      category: "Design"
    },
    {
      title: "Machine Learning Basics",
      instructor: "Sarah Lee",
      duration: "14 weeks",
      students: 1567,
      rating: 4.9,
      level: "Advanced",
      category: "AI & ML"
    },
    {
      title: "Mobile App Development",
      instructor: "Tom Brown",
      duration: "11 weeks",
      students: 2134,
      rating: 4.6,
      level: "Intermediate",
      category: "Development"
    },
    {
      title: "Digital Marketing Strategy",
      instructor: "Emily Davis",
      duration: "6 weeks",
      students: 4123,
      rating: 4.8,
      level: "Beginner",
      category: "Marketing"
    }
  ];

  const handleEnroll = (course: any) => {
    setSelectedCourse(course);
    // Add course to enrolled courses using context
    addCourse(course);
    // Show success dialog
    setShowSuccessDialog(true);
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
              <Button 
                onClick={() => setShowDashboard(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Course Dashboard
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-gradient-primary" />
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                  
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
                  
                  <Button 
                    onClick={() => handleEnroll(course)}
                    className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
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
      
      <Footer />
    </div>
  );
};

export default Courses;
