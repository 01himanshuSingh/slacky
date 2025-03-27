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
    hint:'emoji'
    onEmojiSelect :(emoji:any)=>void
}
export const Emojipoper = ({children, hint, onEmojiSelect}:emojiProps)=>{
  const [poperOpen, setProperOpen]= useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return(

    <TooltipProvider>
      <Popover open={poperOpen} onOpenChange={setProperOpen}>
        <Tooltip 
        open = {tooltipOpen}
        onOpenChange={setTooltipOpen}
        
        >
        {children}
        </Tooltip>
        </Popover>
    </TooltipProvider>
  )
}