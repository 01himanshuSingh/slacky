import React from 'react'
import { Button } from './ui/button';
import { MessageSquare, Pencil, Smile, Trash } from 'lucide-react';
import Hint from './Hint';
import EmojiPicker from '@emoji-mart/react';
import { Emojipoper } from './EmojiProper';
interface ToolbarProps {
  isAuthor?: boolean;
  isPending?: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  hideThreadbutton?: boolean;
  handleReactions?: any;
}
function Toolbar({ isAuthor , 
  isPending , 
  handleEdit, 
  handleThread, 
  handleDelete, 
  hideThreadbutton,
handleReactions }: ToolbarProps
) {
  return (
    <div className='absolute top-0 right-5'>
        <div className='group-hover:opacity-100 opacity-0 transition-opacity border bg-white'>
          
        <Emojipoper 
        hint='Add reaction'
        onEmojiSelect={(emoji) => handleReactions(emoji.native)}>

            <Button variant='ghost'
            disabled={ isPending}
            size={'sm'}>
                <Smile className='size-4 '/>
            </Button>
                </Emojipoper>

           {!hideThreadbutton && (

               <Hint label='Reply in thread'>

               <Button variant='ghost'
            disabled={ isPending} onClick={handleThread}
            size={'sm'}>
                <MessageSquare className='size-4'/>
            </Button>
                </Hint>
            )}  
           
           { isAuthor && (
         
<>
               <Hint label='Edit message'>
               <Button variant='ghost'
            disabled={ isPending} onClick={handleEdit}
            size={'sm'}>
                <Pencil className='size-4'/>
            </Button>
                </Hint>
            
            <Hint label='Delete message'>
               <Button variant='ghost'
            disabled={ isPending} onClick={handleDelete}
            size={'sm'}>
                <Trash className='size-4'/>
            </Button>
                </Hint>
                </>
         
            )}
            
        </div>
         </div>
  )
}

export default Toolbar