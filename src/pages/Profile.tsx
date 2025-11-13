import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Settings, Save, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    qualification: "",
    location: "",
    experience: "",
    govt: "",
    keywords: "",
  });

  const [preferences, setPreferences] = useState({
    jobTypes: [] as string[],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const jobTypes = [
    "Central Government",
    "State Government",
    "Banking & Finance",
    "Railway",
    "Defense",
    "Police",
    "Teaching",
    "Healthcare",
    "Engineering",
    "Legal",
  ];

  const token = localStorage.getItem("token");

  // ✅ FETCH USER INFO + PREFS
  useEffect(() => {
    if (!token) return;

    // Fetch user info
    fetch("http://localhost:4000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          email: data.email || "",
          fullName: data.name || "",
        }));
      });

    // Fetch preferences
    fetch("http://localhost:4000/api/preferences/get", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.pref) {
          setFormData((prev) => ({
            ...prev,
            qualification: data.pref.qualification || "",
            location: data.pref.location || "",
            experience: data.pref.experience || "",
            govt: data.pref.govt || "",
            keywords: data.pref.keywords || "",
          }));

          setPreferences((prev) => ({
            ...prev,
            jobTypes: data.pref.category ? data.pref.category.split(",") : [],
          }));
        }
      });
  }, []);

  // ✅ HANDLERS
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, jobType]
        : prev.jobTypes.filter((type) => type !== jobType),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      qualification: formData.qualification,
      location: formData.location,
      experience: formData.experience,
      govt: formData.govt,
      category: preferences.jobTypes.join(","),
      keywords: formData.keywords,
    };

    const res = await fetch("http://localhost:4000/api/preferences/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("✅ Profile & preferences updated successfully");
    } else {
      toast.error("❌ Failed to update preferences");
    }
  };

  // ✅ LOGOUT
 

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Full Name"
              />
              <Input
                value={formData.email}
                disabled
                placeholder="Email (readonly)"
              />
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} /> Job Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Preferred Location (e.g. Punjab, Delhi)"
              />

              <Input
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Experience (e.g. Fresher, 2 years)"
              />

              <Select
                value={formData.govt}
                onValueChange={(value) => handleInputChange("govt", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Government Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Central Government">
                    Central Government
                  </SelectItem>
                  <SelectItem value="State Government">
                    State Government
                  </SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange("qualification", e.target.value)
                }
                placeholder="Qualification (e.g. B.Tech, M.Sc)"
              />

              <label>Job Categories</label>
              <div className="grid grid-cols-2 gap-3">
                {jobTypes.map((jobType) => (
                  <div key={jobType} className="flex gap-2 items-center">
                    <Checkbox
                      checked={preferences.jobTypes.includes(jobType)}
                      onCheckedChange={(checked) =>
                        handleJobTypeChange(jobType, checked as boolean)
                      }
                    />
                    <p>{jobType}</p>
                  </div>
                ))}
              </div>

              <Textarea
                value={formData.keywords}
                placeholder="Keywords (e.g. banking, IT, defense)"
                onChange={(e) =>
                  handleInputChange("keywords", e.target.value)
                }
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full mt-6 py-6">
            <Save className="mr-2" /> Save Profile
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
