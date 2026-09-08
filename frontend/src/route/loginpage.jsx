import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import { handleError, handleSuccess } from "../utils";
import { UserContext } from "../context/UserContext";

function LoginPage() {
   const [loginInfo, setLoginInfo] = useState({
    email:'',
    password:''
  })
   const { loginUser } = useContext(UserContext); 
   const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {
            const url = `https://boi-lagbe-com.onrender.com/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message,jwtToken, username, profilePic, _id, error } = result;
            if (success) {
                handleSuccess(message);

                const userObj = {
                  _id: _id, 
                  username,
                  email,
                  profilePic: profilePic || "noavatar.png"
                };

                localStorage.setItem("token", jwtToken);
                loginUser(userObj); 

                setTimeout(() => {
                  navigate("/profile");
                }, 1000);
              } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="flex flex-1 flex-col md:flex-row justify-center items-center px-4 py-10 md:py-0 gap-8 md:gap-0">
        <img src="boy.png" alt="" className="hidden sm:block w-40 sm:w-56 md:w-80 lg:w-[500px] h-auto md:mr-20"/>
        <div className="bg-gray-100 p-6 sm:p-10 w-full max-w-md rounded-xl border-3 border-[#FD9846]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FD9846] text-center mb-8 sm:mb-10">
            Login
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-green-600 font-semibold mb-1"
              >
                Email
              </label>
              <input
              onChange={handleChange}
                id="email"
                name="email"
                type="text"
                placeholder="Enter your username"
                value={loginInfo.email}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
              />
            </div>

            <div className="flex flex-col">
  <label
    htmlFor="password"
    className="text-green-600 font-semibold mb-1"
  >
    Password
  </label>

  <div className="relative">
    <input
      onChange={handleChange}
      id="password"
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={loginInfo.password}
      className="w-full border-2 border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
    />

    <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
>
      {showPassword ? (
  // Eye Off
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 15.338 7.244 18 12 18c1.694 0 3.305-.338 4.776-.949M6.228 6.228A10.451 10.451 0 0112 4c4.756 0 8.774 2.662 10.066 6a10.523 10.523 0 01-4.132 5.134M6.228 6.228L3 3m3.228 3.228l12.544 12.544M17.772 17.772L21 21"
    />
  </svg>
) : (
  // Eye
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)}
    </button>
  </div>
</div>

            <button
              type="submit"
              className="bg-[#36A76F] text-gray-100 font-semibold py-2 rounded-lg hover:bg-[#2e8b5e] transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-[#FD9846]  font-semibold mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#36A76F] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default LoginPage;
