'use client'
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/component/AuthScreen";
import { link } from "fs";
import Image from "next/image";
import { useAuthActions } from "@convex-dev/auth/react";
import Userbutton from "@/features/auth/component/Userbutton";
import { useGetWorkspaces } from "@/features/workspaces/api/usegetworkspaces";
import { useEffect, useMemo } from "react";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/createworkspace";
import Model from "@/components/Model";
import { useRouter } from "next/navigation";

export default function  Home() {
  const {signOut} = useAuthActions();
  const {data,isLoading} = useGetWorkspaces();
const router = useRouter();
  const [open,setopen] = useCreateWorkspaceModal();
  const workspacesId  = useMemo(()=>data?.[0]?._id,[data])
  useEffect(()=>{
    if(isLoading){
      return 
    }
    if(workspacesId){
     router.replace(`/workspace/${workspacesId}`)
    }
    else if(!open){
      setopen(true);
    }
    // agar bar bar workspace dikahana hai to [open , setopen ] add
  },[workspacesId, isLoading,  router])

  return (
   <>
  
  
   <Userbutton/>
</>);
}
