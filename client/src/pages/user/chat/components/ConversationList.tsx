import { Search, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/store/slices/chatSlice";

interface Props {
  conversations: Conversation[];
  selectedId: string | null;
  myId: string;
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
}

const getOtherParticipant = (conv: Conversation, myId: string) => {
  const other = conv.participantIds.find((p) => {
    const id = typeof p === "string" ? p : (p as any)._id;
    return id !== myId;
  });
  if (!other) return { name: "Unknown", initial: "?" };
  const name =
    typeof other === "string"
      ? "User"
      : (other as any).name || (other as any).email || "User";
  return { name, initial: name.charAt(0).toUpperCase() };
};

const getUnreadCount = (conv: Conversation, myId: string) => {
  const setting = conv.userSettings?.find(
    (s: any) => s.userId?.toString() === myId
  );
  return setting?.unreadCount || 0;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const ConversationList = ({
  conversations, selectedId, myId, loading,
  search, onSearchChange, onSelect,
}: Props) => (
  <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-card border border-border rounded-2xl overflow-hidden shrink-0">
    {/* Header */}
    <div className="p-4 border-b border-border">
      <h2 className="font-display text-xl font-semibold text-primary mb-3">Messages</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>
    </div>

    {/* List */}
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No conversations yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Start a chat from a deal or requirement page
          </p>
        </div>
      ) : (
        conversations.map((conv) => {
          const other = getOtherParticipant(conv, myId);
          const unread = getUnreadCount(conv, myId);
          const isSelected = conv._id === selectedId;

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(conv._id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className={cn(
                  "font-semibold text-sm",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-accent/20 text-accent"
                )}>
                  {other.initial}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">{other.name}</span>
                  {conv.lastMessageAt && (
                    <span className={cn(
                      "text-xs shrink-0",
                      isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {formatDate(conv.lastMessageAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className={cn(
                    "text-xs truncate",
                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {conv.lastMessageText || "No messages yet"}
                  </span>
                  {unread > 0 && !isSelected && (
                    <Badge className="h-5 min-w-5 px-1.5 text-xs bg-accent text-accent-foreground shrink-0">
                      {unread}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-0.5 block",
                  isSelected ? "text-primary-foreground/50" : "text-muted-foreground/60"
                )}>
                  {conv.contextType} · {conv.contextId?.toString().slice(-6)}
                </span>
              </div>
            </button>
          );
        })
      )}
    </div>
  </div>
);

export default ConversationList;