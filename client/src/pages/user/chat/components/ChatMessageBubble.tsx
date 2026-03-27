import { motion } from "framer-motion";
import { Reply, FileText, Download } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ChatStatusIcon from "./ChatStatusIcon";
import type { ChatMessage } from "@/store/slices/chatSlice";

interface Props {
  msg: ChatMessage;
  isMe: boolean;
  isGroupStart: boolean;
  participantInitial: string;
  onReply: (msg: ChatMessage) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ChatMessageBubble = ({ msg, isMe, isGroupStart, participantInitial, onReply }: Props) => {
  const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 group",
        isMe ? "justify-end" : "",
        isGroupStart ? "mt-3" : "mt-0.5"
      )}
    >
      {/* Avatar for other user */}
      {!isMe && isGroupStart && (
        <Avatar className="h-7 w-7 mt-1 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
            {participantInitial}
          </AvatarFallback>
        </Avatar>
      )}
      {!isMe && !isGroupStart && <div className="w-7 shrink-0" />}

      <div className={cn("max-w-[75%] sm:max-w-[65%]", isMe ? "items-end" : "items-start")}>
        {/* Bubble */}
        <div
          className={cn(
            "px-3.5 py-2 rounded-2xl text-sm leading-relaxed",
            isMe
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border border-border text-foreground rounded-bl-md"
          )}
        >
          {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

          {/* Attachments */}
          {msg.attachments?.map((att: any, ai: number) => (
            <div key={ai} className="mt-2">
              {att.type === "image" ? (
                <div className="rounded-lg overflow-hidden max-w-[200px]">
                  <img src={att.url} alt={att.fileName} className="w-full object-cover" />
                </div>
              ) : (
                <div className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  isMe ? "bg-primary-foreground/10" : "bg-muted"
                )}>
                  <FileText className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{att.fileName}</p>
                  </div>
                  <a href={att.url} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4 shrink-0 cursor-pointer opacity-70 hover:opacity-100" />
                  </a>
                </div>
              )}
            </div>
          ))}

          {/* Time + status */}
          <div className={cn("flex items-center gap-1 mt-1", isMe ? "justify-end" : "")}>
            <span className={cn("text-[9px]", isMe ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {formatTime(msg.sentAt || msg.createdAt)}
            </span>
            {isMe && <ChatStatusIcon status={msg.status} />}
          </div>
        </div>

        {/* Reply action */}
        {/* <button
          onClick={() => onReply(msg)}
          className="hidden group-hover:flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 px-1 hover:text-foreground transition-colors"
        >
          <Reply className="h-3 w-3" /> Reply
        </button> */}
      </div>
    </motion.div>
  );
};

export default ChatMessageBubble;