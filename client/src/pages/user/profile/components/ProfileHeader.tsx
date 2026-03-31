import { motion } from "framer-motion";
import { Camera, Mail, Phone, Building } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm"
    >
      <div className="relative">
        <Avatar className="h-24 w-24 ring-4 ring-champagne/20">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="bg-champagne/20 text-champagne text-2xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-primary">
          {profile.firstName} {profile.lastName}
        </h1>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
            <Mail className="h-4 w-4" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
            <Phone className="h-4 w-4" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm">
            <Building className="h-4 w-4" />
            <span>{profile.companyName}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
