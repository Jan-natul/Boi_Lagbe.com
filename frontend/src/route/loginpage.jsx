import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { handleError, handleSuccess } from "../utils";
import { UserContext } from "../context/UserContext";

function LoginPage() {
   const [loginInfo, setLoginInfo] = useState({
    email:'',
    password:''
  })
   const { loginUser } = useContext(UserContext); 

  const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
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
            const url = `http://localhost:8080/auth/login`;
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

      <div className="flex flex-1 justify-center items-center">
        <img src="boy.png" alt="" className="w-150 h-auto mr-20 mb-30"/>
        <div className="bg-gray-100 p-10 mb-30 w-120 rounded-xl border-3 border-[#FD9846]  max-w-md">
          <h2 className="text-4xl font-bold text-[#FD9846] text-center mb-10">
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
              <input
               onChange={handleChange}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
              />
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
