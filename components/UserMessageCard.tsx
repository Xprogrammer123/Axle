import React from 'react'

const UserMessageCard = () => {
  return (
    <div className='flex flex-col items-end'>
        <div className="flex gap-2.5 items-center mb-4 flex-row-reverse">
          <div className="h-9 w-9 bg-linear-to-br from-neutral-800 to-neutral-950 rounded-full object-cover"></div>
          <div className="flex flex-col justify-end items-end">
            <h2 className="text-dark text- font-medium">Tayo</h2>
            <p className="text-dark/35 text-xs font-semibold">12:35 PM 12/01/26</p>
          </div>
        </div>
        <div className="bg-card w-90 p-3 rounded-2xl">
          <p className='text-dark'>
            Connect to Axle Api repo in my github.
          </p>
        </div>
    </div>
  )
}

export default UserMessageCard