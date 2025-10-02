import React from 'react'

function Channelhero({name, createdAt}: {name?: string, createdAt?: Date}) {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
        <p className='text-2xl font-bold flex items-center mb-2'>
            #{name}
        </p>
        <p className='font-normal text-slate-800 mb-4'>
        This Channel was created on {createdAt ? new Date(createdAt).toLocaleDateString() : 'Unknown date'}.
        </p>
        <p className='text-sm text-slate-600'>
            Channels are where your team communicates. They’re best when organized around a topic – like #marketing or #random – and allow for open conversations.
        </p>
    </div>
   )
}

export default Channelhero