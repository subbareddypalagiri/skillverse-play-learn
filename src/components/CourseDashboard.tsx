import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  Play, 
  Download,
  Clock,
  CheckCircle
} from "lucide-react";

interface CourseDashboardProps {
  enrolledCourses: any[];
  onBack: () => void;
}

const CourseDashboard = ({ enrolledCourses, onBack }: CourseDashboardProps) => {
  // Sample course content data
  const getCourseContent = (courseTitle: string) => {
    return {
      videos: [
        { id: 1, title: "Introduction to Course", duration: "15:30", completed: true },
        { id: 2, title: "Setting up Development Environment", duration: "22:45", completed: true },
        { id: 3, title: "First Project Walkthrough", duration: "35:20", completed: false },
        { id: 4, title: "Advanced Concepts", duration: "28:15", completed: false },
      ],
      notes: [
        { id: 1, title: "Course Overview & Objectives", date: "2024-01-15", type: "PDF" },
        { id: 2, title: "Development Environment Setup Guide", date: "2024-01-16", type: "PDF" },
        { id: 3, title: "Best Practices & Tips", date: "2024-01-17", type: "DOC" },
        { id: 4, title: "Additional Resources", date: "2024-01-18", type: "PDF" },
      ],
      labs: [
        { id: 1, title: "Lab 1: Getting Started", description: "Basic setup and configuration", status: "Completed", dueDate: "2024-01-20" },
        { id: 2, title: "Lab 2: First Application", description: "Build your first application", status: "In Progress", dueDate: "2024-01-25" },
        { id: 3, title: "Lab 3: Advanced Features", description: "Implement advanced functionality", status: "Pending", dueDate: "2024-02-01" },
        { id: 4, title: "Lab 4: Final Project", description: "Complete final project submission", status: "Pending", dueDate: "2024-02-10" },
      ]
    };
  };

  const getProgressPercentage = (courseTitle: string) => {
    const content = getCourseContent(courseTitle);
    const totalItems = content.videos.length + content.labs.length;
    const completedItems = content.videos.filter(v => v.completed).length + 
                          content.labs.filter(l => l.status === "Completed").length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <h1 className="text-4xl font-bold mb-2">My Course Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and access course materials
            </p>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <Card key={index} className="overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300">
                  <div className="h-48 bg-gradient-primary relative">
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-white text-sm mb-2">
                          Progress: {getProgressPercentage(course.title)}%
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(course.title)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">by {course.instructor}</p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Enrolled
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Course Content Tabs */}
          {enrolledCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <Tabs defaultValue="videos" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="videos" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Lectures
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes & Resources
                  </TabsTrigger>
                  <TabsTrigger value="labs" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Labs & Assignments
                  </TabsTrigger>
                </TabsList>

                {/* Video Lectures Tab */}
                <TabsContent value="videos" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} - Video Lectures</h3>
                        <div className="space-y-3">
                          {getCourseContent(course.title).videos.map((video) => (
                            <div key={video.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  video.completed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {video.completed ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h4 className="font-medium">{video.title}</h4>
                                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                {video.completed ? 'Rewatch' : 'Watch'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Notes & Resources Tab */}
                <TabsContent value="notes" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} - Notes & Resources</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {getCourseContent(course.title).notes.map((note) => (
                            <div key={note.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <div>
                                  <h4 className="font-medium">{note.title}</h4>
                                  <p className="text-sm text-muted-foreground">{note.date}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Labs & Assignments Tab */}
                <TabsContent value="labs" className="mt-6">
                  <div className="grid gap-4">
                    {enrolledCourses.map((course, courseIndex) => (
                      <Card key={courseIndex} className="p-6">
                        <h3 className="text-lg font-bold mb-4">{course.title} - Labs & Assignments</h3>
                        <div className="space-y-4">
                          {getCourseContent(course.title).labs.map((lab) => (
                            <div key={lab.id} className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Code className="w-5 h-5 text-orange-500" />
                                  <div>
                                    <h4 className="font-medium">{lab.title}</h4>
                                    <p className="text-sm text-muted-foreground">{lab.description}</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant={lab.status === "Completed" ? "default" : lab.status === "In Progress" ? "secondary" : "outline"}
                                  className={lab.status === "Completed" ? "bg-green-500" : ""}
                                >
                                  {lab.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Due: {lab.dueDate}</p>
                                <Button variant="outline" size="sm">
                                  {lab.status === "Completed" ? "Review" : lab.status === "In Progress" ? "Continue" : "Start"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Empty State */}
          {enrolledCourses.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Enrolled Courses</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any courses yet. Start exploring and enroll in courses to access this dashboard.
              </p>
              <Button onClick={onBack} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                Browse Courses
              </Button>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDashboard;
