import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ThreadBarProps {
    count?: number;
    image?: any
    timestamp?: any 
    onClick?: () => void;
    }

function ThreadBar({count, image, timestamp, onClick}:ThreadBarProps) {
  if(!count ) return null;
    return (<>
    <button onClick={onClick}
    className='p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center transition max-w-[600px]'
    >
        <div className='flex items-center gap-2 overflow-hidden '> 
             <Avatar className="rounded-md size-4">
                <AvatarImage src={image} className="rounded-md" />
                <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs font-semibold">
                  M
                </AvatarFallback>
              </Avatar>
              <span>
                {count} {count === 1 ? 'reply':'replies '}
              </span>
              <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden'>
Last reply 
              </span>
              <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden'>
                View Thread
              </span>
             </div>
    </button>
    
        </>
  )
}

export default ThreadBar