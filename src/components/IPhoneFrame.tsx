import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative w-[375px] h-[667px] bg-black rounded-[60px] overflow-hidden shadow-xl">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] h-[30px] bg-black rounded-b-3xl"></div>
      <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[40%] h-[25px] bg-black rounded-2xl z-10"></div>
      <div className="w-full h-full bg-black rounded-[55px] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default IPhoneFrame;