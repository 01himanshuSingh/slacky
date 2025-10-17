import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: any;
  onClick?: any;
}

function ThreadBar({ count, image, timestamp, onClick }: ThreadBarProps) {
  if (!count) return null;

  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md border border-transparent hover:border-border hover:bg-white flex items-center justify-between transition max-w-[600px] group"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="rounded-md size-4">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs font-semibold">
            M
          </AvatarFallback>
        </Avatar>

        {/* Replies text (always visible) */}
        <span className="text-[#0c577a] text-sm">
          {count} {count === 1 ? "reply" : "replies"}
        </span>

        {/* Hidden text (only visible on hover) */}
        <div className="flex flex-col text-xs text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {timestamp && (
            <span>
              Last reply{" "}
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </span>
          )}
          <span className="text-blue-600 font-medium">View Thread</span>
        </div>
      </div>

      {/* Chevron icon (only visible on hover) */}
      <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0" />
    </button>
  );
}

export default ThreadBar;
