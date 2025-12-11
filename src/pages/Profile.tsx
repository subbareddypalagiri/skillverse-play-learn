import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentProfile from "@/components/StudentProfile";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <StudentProfile />
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
