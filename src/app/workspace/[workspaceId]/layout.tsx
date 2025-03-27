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
  

interface workspaceIdPropslayout{
    children: React.ReactNode;
}

const workoutIdLayout = ({children}:workspaceIdPropslayout)=>{
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
            </ResizablePanelGroup>
        </div>
</div>
    </>
)
}

export default workoutIdLayout