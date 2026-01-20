import React from "react";

const AccountSettingsModal = () => {
  return (
    <div className="bg-white/35 min-h-72 p-3 shadow-xl shadow-dark/16 rounded-2xl backdrop-blur-md absolute bottom-18">
      <div className="border border-dark/7 rounded-xl w-full p-3 h-full">
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <p className="text-xs text-dark/60 font-medium">Available Tokens</p>
            <p className="text-xs text-accent font-bold">500/1000</p>
          </div>
          <div className="h-2 w-40 rounded-full bg-dark/6">
            <div className="w-1/2 rounded-full h-full bg-accent"></div>
                  </div>
                  <div className="flex text-xs text-dark/50 items-center">
                      Plan: Free • Purchased: 1000
                  </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
