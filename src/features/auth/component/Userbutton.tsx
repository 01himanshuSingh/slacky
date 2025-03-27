'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { usercurrentuser } from "../api/usercurrentuser"
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

function Userbutton() {
  // Call the usercurrentuser hook

    const {signOut} = useAuthActions();
  const { data, isLoading } = usercurrentuser();

  // Show loading spinner if data is loading
  if (isLoading) {
    return <Loader className="size-4 animated-spin text-muted-foreground "/>
  }

  // If no data is available (i.e., user is not authenticated), return nothing
  if (!data) {
    return null;
  }

  // Extract name and email from the user data
  const { name, email, image } = data;
  const AvatarFallbackdata = name?.charAt(0).toUpperCase();  // Get the first character of the name for avatar fallback
  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 hover:opacity-70 transition">
          <AvatarImage src={image}/>
          <AvatarFallback>
            {AvatarFallbackdata}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={()=>signOut()}>
          <LogOut className="w-70 h-8" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Userbutton;
