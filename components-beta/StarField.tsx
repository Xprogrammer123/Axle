import React from 'react';
import Starfield from 'react-starfield';

const StarField = () => {
  return (
    <div className='hidden dark:block' style={{ width: '100%', height: '100%', zIndex: "0", position: "absolute" }}>
      <Starfield
        starCount={1000}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        // backgroundColor="black"
      />
      
    </div>
  );
};

export default StarField;