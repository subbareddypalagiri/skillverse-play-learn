import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Calendar, Edit, BookOpen, Trophy, Users, Save, Camera, X, Upload, Link, Image as ImageIcon, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Profile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Student",
    email: "john.student@raise.com",
    location: "New York, USA",
    bio: "Passionate learner exploring tech and innovation",
    profileImage: ""
  });
  const [editData, setEditData] = useState(profileData);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  // Predefined avatar options
  const avatarGallery = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Robot2",
    "https://api.dicebear.com/7.x/personas/svg?seed=Person1",
    "https://api.dicebear.com/7.x/personas/svg?seed=Person2",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool",
  ];

  const userStats = [
    { label: "Courses Completed", value: 8, icon: BookOpen },
    { label: "Achievements", value: 12, icon: Trophy },
    { label: "Events Attended", value: 15, icon: Users }
  ];

  const skills = ["React", "TypeScript", "UI Design", "Python", "Data Analysis", "Public Speaking"];
  
  const recentActivity = [
    { type: "Course", title: "Completed Web Development Masterclass", date: "2 days ago" },
    { type: "Event", title: "Attended AI Tech Talk", date: "5 days ago" },
    { type: "Achievement", title: "Unlocked Speed Learner Badge", date: "1 week ago" }
  ];

  const handleEditClick = () => {
    setEditData(profileData);
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = () => {
    let finalImage = editData.profileImage;
    
    if (previewImage) {
      finalImage = previewImage;
    } else if (imageUrl) {
      finalImage = imageUrl;
    } else if (selectedAvatar) {
      finalImage = selectedAvatar;
    }
    
    setProfileData({
      ...editData,
      profileImage: finalImage
    });
    setIsEditDialogOpen(false);
    stopWebcam();
    resetImageStates();
  };

  const resetImageStates = () => {
    setPreviewImage("");
    setImageUrl("");
    setSelectedAvatar("");
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setImageUrl("");
    setSelectedAvatar("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startWebcam = () => {
    setIsWebcamActive(true);
    if (webcamRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          webcamRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error starting webcam:", error);
        });
    }
  };

  const stopWebcam = () => {
    setIsWebcamActive(false);
    if (webcamRef.current && webcamRef.current.srcObject) {
      (webcamRef.current.srcObject as MediaStream).getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL();
        setPreviewImage(dataURL);
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Profile Header */}
          <Card className="p-8 mb-6 shadow-card">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-32 h-32 border-4 border-primary">
                {(profileData.profileImage) ? (
                  <AvatarImage 
                    src={profileData.profileImage} 
                    alt="Profile Picture" 
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-4xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold">{profileData.name}</h1>
                  <Badge className="bg-gradient-accent text-accent-foreground w-fit mx-auto md:mx-0">
                    Level 7
                  </Badge>
                </div>
                
                <div className="space-y-2 text-muted-foreground mb-4">
                  <div className="flex items-center justify-center md:justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileData.email}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profileData.location}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined March 2024
                  </div>
                </div>
                
                <Button 
                  onClick={handleEditClick}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {userStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 shadow-card text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills */}
            <Card className="p-6 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Add More Skills
              </Button>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <Badge variant="outline" className="mb-2">{activity.type}</Badge>
                    <p className="font-semibold mb-1">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile information below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                placeholder="Enter your location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Profile;
