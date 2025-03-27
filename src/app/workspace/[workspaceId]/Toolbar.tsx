import { Button } from '@/components/ui/button'
import { usesingleGetWorkspace } from '@/features/workspaces/api/usegetsingleworkspaces';
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import { Info, Search } from 'lucide-react'
import React from 'react'

function Toolbar() {
  const workspaceId = useWorkspaceId();
  const { data } = usesingleGetWorkspace({ id: workspaceId });

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-12 p-2">
      {/* Left Section (Search Bar) */}
      <div className="min-w-[280px] flex">
        <Button size="sm" className="bg-accent/25 hover:bg-accent/50 w-full justify-start h-8 px-3">
          <Search className="text-white size-4 mr-2" />
          <span className="text-white text-xs">Search {data?.name}</span>
        </Button>
      </div>

      {/* Right Section (Info Button) */}
      <div className="flex items-center">
        <Button variant="ghost" size="iconsm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
}

export default Toolbar;
