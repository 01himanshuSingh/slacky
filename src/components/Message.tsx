import React from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';
import Hint from './Hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Thumbnail from './Thumbnail';
import Toolbar from './Toolbar';
import { useUpdateMessages } from '@/features/messages/api/use-update-messages';
import { toast } from 'sonner';
import { usedeleteMessages } from '@/features/messages/api/usedelete-message';
import { useConfirm } from '@/hook/Useconfirm';
import { deserialize } from 'v8';
import { useToggleReactions } from '@/features/reactions/api/use-toggle-reaction';
import Reaction from './Reaction';
import { usePanel } from '@/hook/usePanel';
import ThreadBar from './ThreadBar';

const Render = dynamic(() => import('@/components/Render'), { ssr: false });
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor?: boolean;
  reactions: any
  body: any;
  image: any;
  createdAt: any;
  updatedAt: any;
  isEditing: boolean;
  iscompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hidethreadbutton?: boolean;
  threadcount?: any;
  threadImage?: any;
  threadImagestamp?: any;
}

function Message({
  id,
  memberId,
  authorImage,
  authorName,
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  iscompact = false,
  setEditingId,
  hidethreadbutton = false,
  threadcount,
  threadImage,
  threadImagestamp,
}: MessageProps) {
  const avatarFallback = authorName ? authorName.charAt(0).toUpperCase() : '';
const {parentMessageId, onClose, onOpenMessage}=  usePanel()
  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessages();
  const { mutate: deleteMessage, isPending: isDeletingMessage } = usedeleteMessages();
  const { confirm, ConfirmDialog } = useConfirm();
  const {mutate:toggleReaction, isPending:isToggleReaction} = useToggleReactions();
  const isPending = isUpdatingMessage || isDeletingMessage;

  const fullTime = (date: Date) => {
    return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMMM dd, yyyy')}`;
  };

const handleReaction = (value:string)=>{
  if(isToggleReaction) return;
  toggleReaction({messageId:id, value})
  ,{
    onError:()=>{
      toast.error(`Failed to react to message:`);
  }
  
  }
  }
  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated successfully');
          setEditingId(null);
        },
        onError: (error) => {
          toast.error(`Failed to update message: ${error.message}`);
        },
      }
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteMessage(
        { id },
        {
          onSuccess: () => {toast.success('Message deleted')
            // if(parentMessageId === id) onClose()
         
          },
          onError: () => toast.error('Failed to delete message'),
        }
      );
    }
  };

  const MessageContent = (
    <>
      {isEditing ? (
        <div className="w-full h-full">
          <Editor
            onSubmit={handleUpdate}
            disabled={isPending}
            defaultValue={JSON.parse(body)}
            onCanel={() => setEditingId(null)}
            variant="update"
          />
        </div>
      ) : (
        <>
          <Render value={body} />
          <Thumbnail url={image} />
          {updatedAt && <div className="text-xs text-muted-foreground">(edited)</div>}
          <Reaction data={reactions} onchange={handleReaction}/>
          <ThreadBar count={threadcount} image={threadImage} timestamp={threadImagestamp} onClick={()=>onOpenMessage(id)}/>
        </>
      )}

      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending}
          handleEdit={() => setEditingId(id)}
          handleThread={() => onOpenMessage(id)}
          handleDelete={handleDelete}
          hideThreadbutton={hidethreadbutton}
          handleReactions={handleReaction}
        />
      )}
    </>
  );

  return (
    <>
      {iscompact ? (
        <div className="flex flex-col gap-2 p-1.5 px-5 text-sm hover:bg-gray-100/70 group relative">
          <div className="flex items-start gap-2">
            <Hint label={fullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), 'hh:mm a')}
              </button>
            </Hint>
          </div>
          {MessageContent}
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-1.5 px-5 text-sm hover:bg-gray-100/70 group relative">
          <div className="flex items-start gap-2">
            <button>
              <Avatar className="rounded-md">
                <AvatarImage src={authorImage} className="rounded-md" />
                <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs font-semibold">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </button>
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => setEditingId(id)}
                  className="text-primary text-xs hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={fullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:underline">
                    {format(new Date(createdAt), 'hh:mm a')}
                  </button>
                </Hint>
              </div>
              {MessageContent}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog rendered once */}
      <ConfirmDialog />
    </>
  );
}

export default Message;

