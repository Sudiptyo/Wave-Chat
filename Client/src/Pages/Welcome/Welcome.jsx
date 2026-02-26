import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const Welcome = () => {
  return (
    <>
      <div className="min-h-screen bg-linear-to-bl from-violet-600 to-fuchsia-600 flex items-center justify-center space-x-5">
        {/* Left */}
        <div className="flex flex-col items-center space-y-5">
          {/* Left Top */}
          <div className="flex flex-col items-center space-y-3">
            <h2 className="text-white font-extrabold text-5xl">
              Welcome to Wave Chat
            </h2>
            <p className="text-xl font-semibold text-gray-300">
              Connect, Chat and share moments instantly
            </p>
          </div>

          {/* Left Bottom */}
          <div className="">
            <NavLink to="/signup">
              <button
                className="flex items-center text-white font-bold text-xl gap-5 p-5
               bg-linear-to-r from-[#ac0466]  to-[rgb(192,7,151)] shadow-md hover:shadow-xl
                hover:bg-linear-to-r hover:from-[#be0571] hover:to-[rgb(212,8,168)] transition 
               ease-in-out duration-200 rounded-4xl cursor-pointer active:scale-95"
              >
                Get Started
                <FaArrowRightLong />
              </button>
            </NavLink>
          </div>
        </div>

        {/* Right */}
        <div className="">logo</div>
      </div>
    </>
  );
};

export default Welcome;
