'use client'
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { usegetmessage } from '../api/usegetmessage';
import Message from '@/components/Message';
import dynamic from 'next/dynamic'
import { useCurrentMember } from '@/features/members/api/userCurrentMember';

import { useWorkspaceId } from '@/hook/useWorkspaceid';
import Quill from 'quill';
import { useCreateMessages } from '../api/use-create-messages';
import { usegenerateUploadUrl } from '@/features/upload/api/use-generate-UploadUrl';
import { Id } from '../../../../convex/_generated/dataModel';
import { useChannelId } from '@/hook/useChannelId';
import { toast } from 'sonner';
import { useGetMessages } from '../api/usegetmessages';
import { differenceInMinutes, format, isToday, isTomorrow } from 'date-fns';

interface ThreadProps {
    messageId: any; // ID of the parent
    onClose: () => void; // Function to close the thread
}

type CreateMessageValue = {
  channelId: Id<'channels'>;
  parentMessageId?: Id<'messages'> | undefined;
  workspaceId: Id<'workspaces'>;
  body: string;
  image?: Id<'_storage'> | undefined;
}

const Editor = dynamic(()=>import('@/components/Editor'), {ssr:false})

function Thread({messageId, onClose}:ThreadProps) {

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM dd, yyyy');
  };


  const channelId = useChannelId(); 
  const workspaceId = useWorkspaceId()
 const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
 const editorRef = useRef<Quill | null>(null);

   
     const { mutate: createMessage } = useCreateMessages();
     const { mutate: generateUpload } = usegenerateUploadUrl();
   

  const [editingId , setEditingId] = useState<any>()

  const {data: currentMember} = useCurrentMember({workspaceId})
   const {data:message , isLoading}=  usegetmessage({id:messageId});
   const {results, loading}= useGetMessages({channelId, parentMessageId:messageId})
   if(isLoading){
     <div className="h-full items-center justify-center ">

                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </div>}

if(!message){
     return (
    <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center p-4 border-b '>
        <p>Thread</p>
        <Button onClick={onClose}> <XIcon/></Button>    
             </div>
              <div className="h-full items-center gap-y-2 justify-center ">

                <AlertTriangle className="size-5 gap text-muted-foreground"/>
           <p className='text-sm text-muted-foreground '> Message not found</p>
            </div>
        </div>
  )
}


 const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    console.log("🚀 Submitting message:", { body, image });

    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      // Default message payload
      const values: CreateMessageValue = {
        channelId,
        workspaceId,
        body,
        parentMessageId: messageId,
        image: undefined
      };

      if (image) {
        console.log("📸 Uploading image...");

        // Generate upload URL
        const url = await generateUpload({}, { throwError: true });
        if (!url) {
          throw new Error("❌ Upload URL not received from backend");
        }
        console.log("✅ Upload URL received:", url);

        // Upload image to the storage URL
        const uploadResponse = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image
        });

        if (!uploadResponse.ok) {
          throw new Error(`❌ Failed to upload image. Status: ${uploadResponse.status}`);
        }

        // Get storageId after successful upload
        const responseJson = await uploadResponse.json();
        console.log("✅ Image upload successful:", responseJson);

        if (!responseJson.storageId) {
          throw new Error("❌ Image storage ID not found in response");
        }

        values.image = responseJson.storageId;
      }

      // Send message with image reference
      await createMessage(values, { throwError: true });
      console.log("✅ Message successfully created:", values);

      // Reset editor after success
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

 const groupmessages = results.reduce((groups: Record<string, any[]>, message: any) => {
    const createdDate = new Date(message._creationTime);
    const dateKey = format(createdDate, 'yyyy-MM-dd'); // Correct usage

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].unshift(message); // Newest message first
    return groups;
  }, {});

  return (
    <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center p-4 border-b '>
        <p className='text-lg font-bold'>Thread</p>
        <button onClick={onClose}> <XIcon size={17}  /></button>    
             </div>
             <div className='flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar'>

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
                hidethreadbutton
                isAuthor={message.memberId === currentMember?._id}
                
              />
            )
          })}
        </div>
      ))}

              <Message hidethreadbutton 
              memberId={message.memberId}
              authorImage={message.user.image}
              authorName={message.user.name}
              isAuthor = {message.memberId === currentMember?._id}
              body={message.body}
              image={message.image}
              createdAt={message._creationTime}
              updatedAt={message.updatedAt}
id={message._id}
      reactions={message.reactions}
    isEditing= {editingId === message._id}
    setEditingId={setEditingId} 
              /> 
             </div>
             <div >
              <Editor 
              onSubmit={handleSubmit}
              disabled={isPending}
              
               placeholder='Write a reply....' 
/>
             </div>
        </div>      
  )
}

export default Thread