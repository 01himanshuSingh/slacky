import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import Link from 'next/link'
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'
import { cn } from '@/lib/utils'

const sidebarVariant = cva(
    'flex items-center mt-2 gap 1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',{
        variants:{
            variant:{
                default :'text-[#f9edffcc] bg-transparent',
                active:'text-[#481342] bg-white/90 hover:bg-white/90'
            },
        },
        defaultVariants:{
            variant:'default'
        }
    },
)

interface sidebarProps{
    label:string,
    id:string,
    icon:LucideIcon|IconType
    variant?:VariantProps<typeof sidebarVariant>['variant'];
}
export default function SidebarItem({label, id,icon:Icon,variant}:sidebarProps) {
    const workspaceId = useWorkspaceId();
    
  return (
    <Button 
    size='sm'
    className={cn(sidebarVariant({variant:variant}))}   
    asChild>
        <Link href={`/workspace/${workspaceId}/channel/${id}`}>
            <Icon className='size-3.5 mr-1 shrink-0'/>
        <span className='text-sm truncate'>{label}</span>
        </Link>
    </Button>
  )
}
