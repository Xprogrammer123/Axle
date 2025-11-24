import Image from 'next/image'
import React from 'react'

const Logo = ({ size }: { size:number }) => {
  return (
    <div>
        <Image src="/logo.svg" alt='Logo' height={size} width={size} />
    </div>
  )
}

export default Logo