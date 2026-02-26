import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import { TbXboxX } from "react-icons/tb";
import { FaCameraRetro } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";

const SignUp = () => {
  const initialState = {
    fullName: "",
    userName: "",
    mobileNo: "",
    imageUrl: "",
  };
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const fileRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNo") {
      const cleanedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      setForm((prev) => ({ ...prev, mobileNo: cleanedValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    console.log(form);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const openFilePicker = () => {
    fileRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm(initialState);
  };

  const arrow = () => {
    setShowArrow((prev) => !prev);
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-bl from-violet-600 to-fuchsia-600 grid grid-cols-[1fr_1px_1fr]">
        {/* Left */}
        <div className="flex flex-col items-center justify-center space-y-5 px-10">
          {/* Left Top */}
          <div className="flex flex-col items-center space-y-3">
            <h2 className="text-white font-bold text-5xl text-center">
              Welcome to Wave Chat
            </h2>
            <p className="text-xl font-semibold text-gray-300 text-center">
              Connect, Chat and share moments instantly
            </p>
          </div>

          {/* Left Bottom */}
          <div>
            <NavLink to="/">
              <button
                className="flex items-center text-white font-bold text-xl gap-5 p-5
                bg-linear-to-r from-[#ac0466] to-[rgb(192,7,151)] shadow-md hover:shadow-xl
                hover:from-[#be0571] hover:to-[rgb(212,8,168)] transition 
                ease-in-out duration-200 rounded-4xl cursor-pointer active:scale-95"
              >
                <FaArrowLeftLong />
                Get Back
              </button>
            </NavLink>
          </div>
        </div>

        {/* Middle Line */}
        <div className="bg-violet-800 w-full h-full"></div>

        {/* Right */}
        <div className="flex items-center justify-center px-10">
          <div
            className="
            relative
            flex flex-col items-center space-y-5
            w-96 p-8
            rounded-[28px]

            bg-linear-to-br from-white/25 via-white/10 to-white/5
            backdrop-blur-2xl

            border border-white/30
            ring-1 ring-white/20

            shadow-[0_8px_40px_rgba(0,0,0,0.25)]
            overflow-hidden
            "
          >
            {/* Light reflection layer */}
            <div
              className="
              absolute inset-0
              bg-linear-to-br
              from-white/40 via-transparent to-transparent
              opacity-40
              pointer-events-none
              "
            />

            {/* Subtle inner shine */}
            <div
              className="
              absolute -top-10 -left-10 w-40 h-40
              bg-white/30 rounded-full blur-3xl
              opacity-30
              pointer-events-none
              "
            />

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center space-y-5">
              <h3 className="font-bold text-2xl text-white">Sign Up</h3>

              <form
                onSubmit={handleSubmit}
                action=""
                autoComplete="off"
                className="flex flex-col items-center w-full"
              >
                {/* Image Upload */}
                <div
                  onClick={openFilePicker}
                  className="
    relative w-24 h-24 rounded-full  
    overflow-hidden cursor-pointer
    group

    bg-white/10 backdrop-blur-xl
    border border-white/30
    shadow-md

    hover:scale-105
    transition duration-300
  "
                >
                  {/* Image Preview */}
                  {image ? (
                    <img
                      src={image}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      Add
                    </div>
                  )}

                  {/* Camera Icon */}
                  <div
                    className="
      absolute bottom-0 right-2 top-15 
      w-8 h-8 rounded-full
      flex items-center justify-center

      bg-white/30 backdrop-blur-md
      border border-white/40
      shadow-lg

      text-white
    "
                  >
                    {image ? (
                      <FaPencilAlt size={12} />
                    ) : (
                      <FaCameraRetro size={16} />
                    )}
                  </div>

                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={handleImage}
                    className="hidden"
                  />
                </div>

                {/* Input Fields */}
                <div className="space-y-4 w-full mt-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-white font-semibold text-xl">
                      Full Name
                    </p>
                    <div
                      className="border-2 border-white/30 bg-white/10 text-white p-2 
                        rounded-3xl backdrop-blur-md flex items-center"
                    >
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className=" placeholder-[#7a0606] pl-2 focus:outline-none bg-transparent w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <p className="text-white font-semibold text-xl">
                      User Name
                    </p>
                    <div
                      className="border-2 border-white/30 bg-white/10 text-white 
                       p-2 rounded-3xl backdrop-blur-md flex items-center"
                    >
                      <input
                        type="text"
                        placeholder="Enter your user name"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        className="placeholder-[#7a0606] pl-2 focus:outline-none w-full bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <p className="text-white font-semibold text-xl">
                      Mobile Number
                    </p>
                    <div className="border-2 border-white/30 bg-white/10 backdrop-blur-md p-2 rounded-3xl flex items-center gap-3 text-white">
                      <div className="flex items-center gap-1">
                        <p className="text-[#680505]">+91</p>
                        <button
                          type="button"
                          onClick={arrow}
                          className="cursor-pointer text-[#680505]"
                        >
                          {showArrow ? (
                            <MdKeyboardArrowUp />
                          ) : (
                            <MdKeyboardArrowDown />
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your number"
                        name="mobileNo"
                        maxLength={10}
                        inputMode="numeric"
                        value={form.mobileNo}
                        onChange={handleChange}
                        className="flex-1 bg-transparent focus:outline-none text-white placeholder-[#7a0606]"
                      />
                    </div>

                    {form.mobileNo.length > 0 && form.mobileNo.length < 10 && (
                      <div className="text-orange-800 flex items-center justify-center gap-2 text-sm">
                        <TbXboxX />
                        <p>Mobile Number must be of 10 digits</p>
                      </div>
                    )}

                    <div className="text-center mt-2">
                      <p className="text-[#630505]">
                        Already have an Account ?
                        <NavLink className="text-blue-600 pl-2" to="/signin">
                          Login
                        </NavLink>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 p-3 text-white font-semibold rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition ease-in-out duration-200 
                  bg-linear-to-r from-purple-700 to-violet-500 
                  hover:from-purple-500 hover:to-violet-800 active:scale-95 w-full"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
