import Image from 'next/image'
import React from 'react'

const ModelMessageCard = () => {
  return (
    <div className='flex flex-col items-start'>
        <div className="flex gap-2.5 items-center mb-4">
          <Image src="/ailogo.svg" alt="" width={100} height={100} className='h-9 w-9 object-cover' />
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-dark text- font-medium">Axle</h2>
            <p className="text-dark/35 text-xs font-semibold">12:35 PM 12/01/26</p>
          </div>
        </div>
        <div className="bg-card flex flex-col gap-4 w-90 p-3 rounded-2xl">
          <p className='text-dark'>
            Alright! let me get your details to create a secure connection.
          </p>
          <div className="p-2 text-xs rounded-lg px-3 bg-white font-semibold text-success">Connected to https://github.com/therealteejay25/Axle-Api</div>
          <p className='text-dark'>
            I’ve successfully connected to the Axle-Api repo.
          </p>
        </div>
    </div>
  )
}

export default ModelMessageCard