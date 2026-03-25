import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  participantName: string;
  participantInitial: string;
  contextType: "REQUIREMENT" | "DEAL";
  contextId: string;
}

const ChatHeader = ({ participantName, participantInitial, contextType, contextId }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border bg-card shrink-0">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={() => navigate("/user/messages")}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {participantInitial}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-foreground truncate">{participantName}</h2>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0 h-4 font-medium cursor-pointer",
            contextType === "DEAL"
              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
              : "border-blue-300 text-blue-700 bg-blue-50"
          )}
          onClick={() =>
            navigate(
              contextType === "DEAL"
                ? `/user/deals/${contextId}`
                : `/user/requirements`
            )
          }
        >
          {contextType === "DEAL" ? "🤝 " : "📋 "}
          {contextId?.toString().slice(-8)}
        </Badge>
      </div>
    </div>
  );
};

export default ChatHeader;