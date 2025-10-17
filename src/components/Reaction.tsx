import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { useCurrentMember } from '@/features/members/api/userCurrentMember';

import { cn } from '@/lib/utils';
import Hint from './Hint';
import { Emojipoper } from './EmojiProper';
import { MdOutlineAddReaction } from 'react-icons/md';

interface ReactionProps {
    data: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<'members'>[];
        }
    >;
    onchange: (value:any) => void;
}

function Reaction({data, onchange}:ReactionProps) {
  const workspaceId  = useWorkspaceId()
  const {data:currentMember} = useCurrentMember({workspaceId});
  if(data.length === 0 || !currentMember) return null;
    return (
    <div >{data.map((reaction)=>[
        <Hint key={reaction._id.toString()} label={`${reaction.count} ${reaction.count > 1 ? 'people' : 'person'} reacted with ${reaction.value}`} side="top" align="center">
        <button onClick={()=>onchange(reaction.value)} className={cn('h-6 px-2 rounded-full bg-slate-200/70 border-transparent text-slate-800  items-center gap-1 hover:bg-slate-300/80' )}>
            {reaction.value}
            <span>{reaction.count}</span>
        </button></Hint>
    ])}
    <Emojipoper 
    hint='Add Reaction'

    onEmojiSelect ={(emoji:any)=>onchange(emoji.native)}
    >
        <button className='h-7  px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-400/50 text-slate-800 hover:bg-slate-300/80  gap-x-1'>
            <MdOutlineAddReaction/>
        </button>
    </Emojipoper>
    </div>
  )
}

export default Reaction