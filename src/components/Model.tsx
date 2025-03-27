'use client'
import CreateChannelModal from '@/features/channels/Component/CreateChannelModal';
import { CreateWorkspaces } from '@/features/workspaces/component/CreateWorkspaces'
import React, { useEffect, useState } from 'react'

function Model() {
  const [mounted, setmount]= useState(false);
  useEffect(()=>{
    setmount(true);
  },[])
  if(!mounted){
    return null
  }
  return (
    <>
    <CreateChannelModal/>
    <CreateWorkspaces/>                                                             
    </>
  )
}

export default Model