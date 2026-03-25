import { Check, CheckCheck } from "lucide-react";

type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ";

const ChatStatusIcon = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case "SENDING":
      return (
        <div className="h-3 w-3 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
      );
    case "SENT":
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case "DELIVERED":
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case "READ":
      return <CheckCheck className="h-3 w-3 text-primary" />;
  }
};

export default ChatStatusIcon;