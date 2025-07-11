import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import React, { useState } from "react"

  interface emojiProps{
    children:React.ReactNode
    hint?:string
    onEmojiSelect :(emoji:any)=>void
}
export const Emojipoper = ({children, hint='Emoji', onEmojiSelect}:emojiProps)=>{
  const [poperOpen, setProperOpen]= useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const onSelectemoji = (emoji:any )=>{
    onEmojiSelect(emoji)
    setProperOpen(false)
    setTimeout(() => {
      setTooltipOpen(false)
    }, 500);
  }
  return(

    <TooltipProvider>
      <Popover open={poperOpen} onOpenChange={setProperOpen}>
        <Tooltip 
        open = {tooltipOpen}
        onOpenChange={setTooltipOpen}
        delayDuration={50}
        > 
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
        {children}
        </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent className="bg-black text-white border border-white1/5">
          <p className="font-medium text-xs text-white ">{hint}</p>
        </TooltipContent>
        <PopoverContent className='p-0 w-full border-none shadow-none '>
          <Picker data={data} onEmojiSelect={onSelectemoji}/>
        </PopoverContent>
        </Tooltip>
        </Popover>
    </TooltipProvider>
  )
}