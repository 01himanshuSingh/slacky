import Userbutton from '@/features/auth/component/Userbutton'
import React from 'react'
import WorkspaceSwitcher from './WorkspaceSwitcher'
import SidebarButton from './SidebarButton'
import { Bell, Home, MessageSquare, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

function Slidebar() {
const pathname = usePathname();
  return (
    <aside className='w-[100px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4'>
      <div><WorkspaceSwitcher/>
      <SidebarButton icons={Home} label='home' isActive/>
       <SidebarButton icons={MessagesSquare} label='DMs' isActive/>

       <SidebarButton icons={Bell} label='Notification' isActive/>
       <SidebarButton icons={MoreHorizontal} label='More' isActive/>
      </div>
      <div className=' flex flex-col items-center justify-center gap-y-1 mt-auto'>
        <Userbutton/>
      </div>
    </aside>
  )
}

export default Slidebar