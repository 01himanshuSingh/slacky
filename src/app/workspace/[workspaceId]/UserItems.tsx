import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { cva ,type VariantProps} from 'class-variance-authority'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


const userItemVariant = cva(
    'flex items-center mt-2 gap 1.5 justify-start  font-normal h-7 px-4 text-sm overflow-hidden',{
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
interface userItemProps{
    id:Id<'members'>    // member ki id jo jo aenge 
    label?:string
    image?:string
    variant?:VariantProps<typeof userItemVariant>['variant']   
}
export default function UserItems({id,label='Member', image, variant}:userItemProps) {
    const workspaceId = useWorkspaceId()
    const avtarFallback = label.charAt(0);
  return (
    <>
    <Button
    className={cn(userItemVariant({variant:variant}))}
    size='sm'
    asChild
    >
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className='size-5 rounded-md mr-1'>
            <AvatarImage className='rounded-md ' src={image} />
                <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>
                    {avtarFallback}
                </AvatarFallback>

            </Avatar>
            <span className='text-sm truncate'>{label}</span>
            </Link>
    </Button>
    </>
  )
}
