"use client"
import { EnvelopeOpenIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex text-white flex-col bg-dark h-screen p-7 w-screen overflow-hidden'>
        <div>
                  <Image src="/logo.svg" alt="Logo" width={100} height={100} className='h-auto w-20' />
                </div>
                <div className='w-full h-full flex gap-6 flex-col justify-center items-center'>
                  <div  className="bg-white/2 gap-4 flex flex-col w-100 h-auto p-5 rounded-2xl">
                      <EnvelopeOpenIcon className="text-base h-14 mx-auto w-14" />
                      <p className='text-sm text-center'>Your magic link has been sent to therealteejay25@gmail.com. <br /> Please check your mail to proceed.</p>
                    <button className='flex w-full items-center gap-2 justify-center cursor-pointer bg-base text-white font-semibold p-3 rounded-full'>
                      Continue
                    </button>
                  </div>
                  <div className='text-white text-sm'>
                    By continuing, you agree to our <Link className="font-semibold" href="/tc">terms of condition</Link> and <Link className="font-semibold" href="/privacy-policy">privacy policy.</Link>
                  </div>
                </div>
    </div>
  )
}

export default page