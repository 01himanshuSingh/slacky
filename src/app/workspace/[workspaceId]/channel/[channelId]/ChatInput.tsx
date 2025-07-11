import { useCreateMessages } from '@/features/messages/api/use-create-messages'
import { usegenerateUploadUrl } from '@/features/upload/api/use-generate-UploadUrl'
import { useChannelId } from '@/hook/useChannelId'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import dynamic from 'next/dynamic'
import Quill from "quill";
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Id } from '../../../../../../convex/_generated/dataModel'

const Editor = dynamic(()=>import('@/components/Editor'), {ssr:false})

interface ChatInputProps {
  placeholder: string
}

type CreateMessageValue = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  body: string;
  image?: Id<'_storage'> | undefined;
}

export default function ChatInput({ placeholder }: ChatInputProps) {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  
  const { mutate: createMessage } = useCreateMessages();
  const { mutate: generateUpload } = usegenerateUploadUrl();

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
      image: undefined
    };

    if (image) {
      console.log("📸 Uploading image...");

      // Get presigned upload URL and public image URL from backend
      const uploadInfo = await generateUpload({}, { throwError: true });

      if (!uploadInfo?.uploadUrl || !uploadInfo?.publicUrl) {
        throw new Error("❌ Upload info (uploadUrl/publicUrl) missing from backend");
      }

      // Upload image to presigned URL
      const uploadResponse = await fetch(uploadInfo.uploadUrl, {
        method: 'PUT', // Use 'PUT' for most S3-like storage providers
        headers: { 'Content-Type': image.type },
        body: image
      });

      if (!uploadResponse.ok) {
        throw new Error(`❌ Failed to upload image. Status: ${uploadResponse.status}`);
      }

      // Use the public URL in the message
      values.body += `\n![image](${uploadInfo.publicUrl})`; // Or handle differently as per your Markdown/HTML handling
    }

    // Send message with image URL in body
    await createMessage(values, { throwError: true });
    console.log("✅ Message successfully created:", values);

    // Reset editor
    setEditorKey((prevKey) => prevKey + 1);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    toast.error("Failed to send message");
  } finally {
    setIsPending(false);
    editorRef.current?.enable(true);
  }
};


  return (
    <div className='px-4 w-full'>
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
      />
    </div>
  );
}
