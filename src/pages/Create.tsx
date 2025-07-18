import InstagramNavbar from "@/components/InstagramNavbar";
import InstagramUpload from "@/components/InstagramUpload";

export default function Create() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramNavbar />
      
      <div className="pt-16 pb-20 lg:pl-64 lg:pt-8 lg:pb-8">
        <InstagramUpload />
      </div>
    </div>
  );
}