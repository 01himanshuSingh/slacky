import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function Conversationhero({name ='member ', image}: {name?: string, image?:any}) {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
        <div className='flex items-center gap-x-1 mb-1'>
            <Avatar className='size-7 rounded-md mr-1'>
               <AvatarImage className='rounded-md ' src={image} />
                <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                    {name?.charAt(0)}
                </AvatarFallback>
                </Avatar>
            
        </div>
        <p className='text-2xl '>
            {name}
        </p>
        <p className='font-normal text-slate-800 mb-4'>
        This conversation is  between you and {name} is private. Only the two of you can see what’s inside.
        </p>
      
    </div>
   )
}

export default Conversationhero