import Hint from '@/components/Hint';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react'
import {useToggle} from 'react-use'
import { FaCaretDown } from 'react-icons/fa';
import { cn } from '@/lib/utils';
interface workspaceProps{
    children:React.ReactNode;
    label:string,
    hint:string,
    onNew?:()=>void
}
export default function WorkspaceSecton({children, label, hint, onNew}:workspaceProps) {

  const [on ,toggle]= useToggle(true)
  return (
    <div
    className='flex flex-col mt-3 px-2'
    >
        <div className='flex items-center px-3.5 group'>
          <Button   className='p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6 bg-transparent' onClick={toggle}>
            <FaCaretDown className={cn("size-4 transition-transform", on && "-rotate-90")}/>
          </Button>
          <Button size='sm' className='group px-1.5 ml-0.5 text-sm text-[#f9edffcc] h-[28px] bg-transparent justify-start overflow-hidden items-center' >
            <span className='truncate'>{label}</span>
            </Button>
            {onNew && (
              <Hint label={hint} side='top' align='center'>
               <Button 
  onClick={onNew} 
  size='sm' 
  className='opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm size-6 shrink-0 text-[#f9edffcc]'>
  <Plus className='size-5' />
</Button>
              </Hint>
            )}
        </div>
        {on && children}</div>
  )
}
