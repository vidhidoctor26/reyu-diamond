import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X, User, Mail, Phone, Building, MapPin } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "./hooks/useProfile";
import ProfileHeader from "./components/ProfileHeader";
import StatusBadges from "./components/StatusBadges";
import StatsGrid from "./components/StatsGrid";
import ActionPanel from "./components/ActionPanel";
import ProfileSkeleton from "./components/ProfileSkeleton";
import ProfileError from "./components/ProfileError";

const Profile = () => {
  const { profile, stats, state, retry, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        companyName: profile.companyName || "",
        companyType: profile.companyType || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        companyName: profile.companyName || "",
        companyType: profile.companyType || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Unable to update profile",
        description:
          err?.response?.data?.message || err?.message || "Please try again later.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-3 lg:p-2 space-y-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary">Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your identity, verification, and trading reputation
          </p>
        </motion.div>

        {state === "loading" && <ProfileSkeleton />}
        {state === "error" && <ProfileError onRetry={retry} />}

        {state === "success" && profile && stats && (
          <div className="space-y-6">
            <ProfileHeader profile={profile} />
            <StatusBadges profile={profile} />
            <StatsGrid stats={stats} />
            <ActionPanel profile={profile} onEdit={handleEdit} />

            {/* Edit Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-display text-xl">Edit Profile</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className="pl-12 h-12 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-12 h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-12 h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                              className="pl-12 h-12 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companyType">Business Type</Label>
                          <Select
                            value={formData.companyType}
                            onValueChange={(value) => setFormData({ ...formData, companyType: value })}
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dealer">Diamond Dealer</SelectItem>
                              <SelectItem value="manufacturer">Manufacturer</SelectItem>
                              <SelectItem value="wholesaler">Wholesaler</SelectItem>
                              <SelectItem value="retailer">Retailer</SelectItem>
                              <SelectItem value="broker">Broker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="pl-12 h-12 rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="min-h-[120px] rounded-xl resize-none"
                          placeholder="Tell others about your trading experience..."
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1 gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
