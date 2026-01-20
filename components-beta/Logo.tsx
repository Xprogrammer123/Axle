import Image from 'next/image'
import React from 'react'

type LogoType = {
    size: number
}

const Logo = ({ size } : LogoType) => {
  return (
      <div>
          <Image src="/beta/logo.svg" alt="Axle logo" width={size} height={size} />
    </div>
  )
}

export default Logo