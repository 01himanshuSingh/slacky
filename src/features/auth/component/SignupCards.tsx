'use client '
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { FaGithub, FaLeaf } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { useAuthActions } from "@convex-dev/auth/react";
 
import { Signflow } from '../types'
import { TriangleAlert } from 'lucide-react'

interface SignUpCardsProps{
    setstate: (state:Signflow)=>void
}
export const SignupCards=({setstate}:SignUpCardsProps)=> {
    const [name , setname] = useState('')
     const [email, setemail] = useState('');
        const [password, setpassword] = useState('');
        const [confirmpassword, setconfirmPassword] = useState('');
 const [error, seterror] = useState('');
    
    const [pending, setPending] = useState(false)
         const { signIn } = useAuthActions();
        
          const onPasswordSignIn = (e:React.FormEvent<HTMLFormElement>)=>{
                 e.preventDefault();
                if(password !== confirmpassword){
                    seterror('Password do not matching ');
                    return;
                }

                 setPending(true);
                 signIn('password', {name, email, password, flow:'signUp'})
                 .catch(()=>{
                     seterror('Something went wrong')
                 })
                 .finally(()=>{
                     setPending(false);
                 })
             }
            const handleProvider = (value:'github'|'google')=>{
                setPending(true)    
                signIn(value)
                .finally(()=>{
                    setPending(false);
                })
            }
        
    
  return (
    <Card className=' w-full h-full p-8'>
    <CardHeader className=' px-0 pt-0'>
        <CardTitle >

        Register to continue 
        </CardTitle>
        <CardDescription className='pb-2'>
        Use your email or another service 
    </CardDescription>
    </CardHeader>
    {!!error && (
            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                <TriangleAlert className='size-4'/>
                <p>{error}</p>
            </div>
        )}
    <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onPasswordSignIn} className='space-y-2.5'>
          <Input disabled={pending} value={ name}onChange={(e)=>{setname(e.target.value)}} placeholder='Username'type='text' required/>
      
 <Input disabled={pending} value={ email}onChange={(e)=>{setemail(e.target.value)}} placeholder='Email'type='email' required/>
      

                      <Input disabled={pending} value={password} onChange={(e)=>{setpassword(e.target.value)}} placeholder='Password'type='password' required/>
      
                      <Input disabled={pending} value={confirmpassword} onChange={(e)=>{setconfirmPassword(e.target.value)}} placeholder='Confirm Password'type='password' required/>
      
      
            <Button type='submit' className='w-full ' size='lg' disabled={pending}>Submit</Button>
        
        </form>
        <Separator/>
            <div className='flex flex-col gap-y-2.5'>
                <Button 
                disabled={pending}
                
                onClick={()=>{handleProvider('google')}}
                variant='outline'
                size='lg'
                className='w-full relative'>
                    <FcGoogle className='size-5 absolute top-2.5 left-3.5'/>
                    Continue with Google
                </Button>

                <Button 
                disabled={pending}
                
                onClick={()=>{handleProvider('github')}}
                variant='outline'
                size='lg'
                className='w-full relative'>
                    <FaGithub   className='size-5 absolute top-2.5 left-3.5'/>
                    Continue with Github
                </Button>
            </div>
        <p className='text-xs text-muted-foreground'>
            Already have account ?  <span className='text-sky-700 hover:underline cursor-pointer' onClick={()=>setstate('signIn')}>
                Sign In
            </span>
        </p>
    </CardContent>
</Card>


   )
}
