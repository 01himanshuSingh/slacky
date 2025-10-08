'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  memberName: any;
  memberImage:any
  onClick?:()=>void
}

export default function Header({ memberName = 'member' , memberImage, onClick}: HeaderProps) {
  const avtarFallback = memberName?.charAt(0).toUpperCase() || 'U';
  return (
    <>
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
       <Button variant='ghost' className="p-0 text-lg font-semibold px-2 overflow-hidden w-auto " size='sm' onClick={onClick}>
         <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage}/>
          <AvatarFallback>
            {avtarFallback}
          </AvatarFallback>
         </Avatar>
         <span className="truncate "> {memberName}</span>
       <FaChevronDown className="size-2.5 ml-2" />
       
       </Button>
       </div>
    </>
  );
}
