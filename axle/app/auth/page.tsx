"use client"
import { EnvelopeIcon, UserIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { AuthRequestType } from '@/types/AuthRequest'
import apiRequest from '@/lib/api'
import { useRouter } from 'next/navigation'

const Authpage = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authRequestBody: AuthRequestType = {
      name: name,
      email: email
    };

      try {
      if (!email || !email.includes("@")) throw new Error("Invalid email.");
      if (!name || name.trim().length < 2) throw new Error("Invalid name.");
  
      const res = await apiRequest(`/auth/request-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authRequestBody),
      });
  
      // handle response
      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = {err};
      }
  
      if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  
      router.push("/success");
    } catch (err: any) {
      console.error("Request link error:", err.message || err);
  
      router.push("/error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col bg-dark h-screen p-7 w-screen overflow-hidden'>
        <div>
          <Image src="/logo.svg" alt="Logo" width={100} height={100} className='h-auto w-20' />
        </div>
        <div className='w-full h-full flex gap-6 flex-col justify-center items-center'>
          <h1 className='text-2xl font-semibold text-white text-center'>Enter your email to <br /> continue to axle.</h1>
          <form onClick={(e) => {handleSubmit(e)}} className="bg-white/2 gap-4 flex flex-col w-100 h-auto p-5 rounded-2xl">
            <div className='flex w-full items-center gap-2 bg-white/2 p-3 rounded-xl'>
              <UserIcon className="text-white/50 h-5 w-5" />
              <input type="text" onChange={(e) => {setName(e.target.value)}} placeholder='Enter your name here...' className='placeholder:text-white/50 w-full outline-0 text-white' />
            </div>
            <div className='flex w-full items-center gap-2 bg-white/2 p-3 rounded-xl'>
              <EnvelopeIcon className="text-white/50 h-5 w-5" />
              <input type="email" onChange={(e) => {setEmail(e.target.value)}} placeholder='Enter your email address here...' className='placeholder:text-white/50 w-full outline-0 text-white' />
            </div>
            <button className='flex w-full items-center gap-2 justify-center cursor-pointer bg-base text-white font-semibold p-3 rounded-full'>
              Continue
            </button>
          </form>
          <div className='text-white text-sm'>
            By continuing, you agree to our <Link className="font-semibold" href="/tc">terms of condition</Link> and <Link className="font-semibold" href="/privacy-policy">privacy policy.</Link>
          </div>
        </div>
    </div>
  )
}

export default Authpage