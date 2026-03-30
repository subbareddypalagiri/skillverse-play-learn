import PageLayout from "@/components/PageLayout";
import StudentProfile from "@/components/StudentProfile";
import ProfileReelsSection from "@/components/ProfileReelsSection";

const Profile = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <StudentProfile />
        <ProfileReelsSection />
      </div>
    </PageLayout>
  );
};

export default Profile;
