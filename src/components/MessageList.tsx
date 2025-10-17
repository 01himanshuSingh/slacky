'use client';

import React, { useState } from 'react';
import { differenceInMinutes, format, isToday, isTomorrow } from 'date-fns';
import Message from './Message';
import Channelhero from './Channelhero';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { useCurrentMember } from '@/features/members/api/userCurrentMember';
import Conversationhero from './Conversationhero';

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelcreatedAt?: any;
  variant?: 'default' | 'channel' | 'thread'|'conversation';
  data: any;
  isLoading?: boolean;
}

function MessageList({
  memberName,
  memberImage,
  channelName,
  channelcreatedAt,
  variant = 'default',
  data,
  isLoading = false,
}: MessageListProps) {
  // ✅ Ensure data is always an array
  const messagesArray = Array.isArray(data) ? data : [];
  const [editingId, setEditingId]=  useState<any>();
  const workspaceId = useWorkspaceId()
  const {data:currenmember} = useCurrentMember({workspaceId});
  // ✅ Group messages by date
  const groupmessages = messagesArray.reduce((groups: Record<string, any[]>, message: any) => {
    const createdDate = new Date(message._creationTime);
    const dateKey = format(createdDate, 'yyyy-MM-dd'); // Correct usage

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].unshift(message); // Newest message first
    return groups;
  }, {});

  // ✅ Date label formatting
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM dd, yyyy');
  };

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupmessages).map(([date, messages]) => (
        <div key={date}>
          {/* 🗓 Date separator */}
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 w-full border-t border-gray-300" />
            <span className="relative z-10 bg-white px-4 text-gray-600 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(date)}
            </span>
          </div>

          {/* 💬 Messages for that date */}
          {messages.map((message: any, index: number) => {
              const prevMessage = messages[index - 1];

  const isCompact =
    prevMessage &&
    prevMessage.user?._id === message.user._id &&
    differenceInMinutes(
      new Date(message._creationTime),
      new Date(prevMessage._creationTime)
    ) < 5;
            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message._updatedAt}
                createdAt={message._creationTime}
                threadcount={message.threadCount}
                threadImage={message.threadImage}
                threadImagestamp={message.threadImageStamp}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                iscompact={isCompact}
                hidethreadbutton={variant === 'thread'}
                isAuthor={message.memberId === currenmember?._id}
                
              />
            )
          })}
        </div>
      ))}
      {variant === 'channel' && channelName && channelcreatedAt && (
        <Channelhero 
        name={channelName}
        createdAt={channelcreatedAt}
        />
      )}
       {variant === 'conversation' && memberName && memberImage && (
        <Conversationhero
        name={memberName}
        image={memberImage}
        />
      )}
    </div>
  );
}

export default MessageList;
