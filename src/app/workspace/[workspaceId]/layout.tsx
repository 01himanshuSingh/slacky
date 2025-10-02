'use client'
import React from "react"
import Toolbar from "./Toolbar";
import Slidebar from "./Slidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import WorkspaceSlider from "./WorkspaceSlider";
import { useParentMessageId } from "@/features/messages/store/useParentMessageid";
import { usePanel } from "@/hook/usePanel";
import { Loader } from "lucide-react";
import Thread from "@/features/messages/component/Thread";
import { Id } from "../../../../convex/_generated/dataModel";
  

interface workspaceIdPropslayout{
    children: React.ReactNode;
}

const workoutIdLayout = ({children}:workspaceIdPropslayout)=>{
    const {parentMessageId, onClose} =  usePanel();
    const showPanel = !!parentMessageId;

return (
    <>
    <div className="h-full ">
        <Toolbar/>
        <div className="flex h-[calc(100vh-40px)]">
            <Slidebar/>
            <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel
            defaultSize={20}
            minSize={17}
            className="bg-[#5E2C5f]"
            >
                <WorkspaceSlider/>
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel minSize={20}>

        {children}
            </ResizablePanel>
            {showPanel && (
                <>
                <ResizableHandle withHandle/>
            <ResizablePanel
            defaultSize={30}
            maxSize={30}
            minSize={20}
            className="border-l border-slate-300/20 bg-[#f5f5f5]"
            >
                {parentMessageId ? (
                    <div className="h-full">
                        <Thread messageId={parentMessageId as Id<'messages'>} onClose={onClose}/>
                    </div>
                ):(
                <div className="h-full items-center justify-center ">

                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </div>)}
            </ResizablePanel>

                </>)}
            </ResizablePanelGroup>
        </div>
</div>
    </>
)
}

export default workoutIdLayout