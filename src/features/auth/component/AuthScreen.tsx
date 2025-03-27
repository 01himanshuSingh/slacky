'use client'

import { useState } from "react"
import { Signflow } from "../types"

import { SingnInCards } from "./SingnInCards"
import { SignupCards } from "./SignupCards"

function AuthScreen() {
    const [state, setstate] = useState<Signflow>('signIn')
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3b58]">
        <div className="md:h-auto md:w-[420px]">
{state =='signIn'?<SingnInCards setstate={setstate}/>: <SignupCards setstate = {setstate}/>}
        </div>
        </div>
  )
}

export default AuthScreen