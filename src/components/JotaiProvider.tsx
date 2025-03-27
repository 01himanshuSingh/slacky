'use client'
import { Provider } from 'jotai'
import React from 'react'

interface JotaiProps{
  children:React.ReactNode
}
function Jotai({children}:JotaiProps) {

    return (
    <Provider>
      {children}
    </Provider>
  )
}

export default Jotai