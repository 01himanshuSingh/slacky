import { userGetMember } from '@/features/members/api/useGetMember'
import { useGetMessages } from '@/features/messages/api/usegetmessages'
import { useMemberId } from '@/hook/useMemberId'
import { AlertTriangle } from 'lucide-react'
import React from 'react'
import Header from './Header'
import ChatInputMember from './ChatInputmember'
import MessageList from '@/components/MessageList'

function Conversation({id}:{id:any}) {
  const memberId = useMemberId()
  const {data:member , isLoading:memberLoading } = userGetMember({memberId})
  const {results , loading} = useGetMessages({
    conversationId:id

  })
  if(loading || memberLoading) {
     return (
      <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
        <AlertTriangle className='size-6 text-muted-foreground' />
       </div>
    )
  }
  return (
    <div className='flex flex-col h-full'>
      <Header memberName={member?.user.name} memberImage={member?.user.image} onClick={()=>{}}/>
     <MessageList data={results} variant='conversation' memberImage={member?.user.image} memberName={member?.user.name}   />
     
        <ChatInputMember placeholder={`Message ${member?.user.name}`}  conversationId={id}/>
    </div>
  )
}

export default Conversation