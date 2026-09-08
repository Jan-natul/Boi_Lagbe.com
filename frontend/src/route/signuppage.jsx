import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../Components/Footer'
import { handleError, handleSuccess } from '../utils'

const SignupPage = () => {

  const [signupInfo, setSignupInfo] = useState({
    username:'',
    email:'',
    password:''
  })

  const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { username, email, password } = signupInfo;
        if (!username || !email || !password) {
            return handleError('name, email and password are required')
        }
        try {
            const url = `https://boi-lagbe-com.onrender.com/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err);
        }
    }

  return (
    <>
     <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="flex flex-1 flex-col md:flex-row justify-center items-center px-4 py-10 md:py-0 gap-8 md:gap-0">
        <img src="boy2.png" alt="" className='hidden sm:block w-40 sm:w-56 md:w-80 lg:w-[500px] h-auto md:mr-20'/>
        <div className="bg-gray-100 p-6 sm:p-10 w-full max-w-md rounded-xl border-3 border-[#FD9846]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FD9846] text-center mb-8 sm:mb-10">
            Create an Account
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">

            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-[#36A76F] font-semibold mb-1"
              >
                Username
              </label>
              <input
                onChange={handleChange}
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={signupInfo.username}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[#36A76F] font-semibold mb-1"
              >
                Email
              </label>
              <input
                onChange={handleChange}
                id="email"
                name="email"
                type="text"
                placeholder="Enter your email"
                value={signupInfo.email}
                className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-[#36A76F] font-semibold mb-1"
              >
                Password
              </label>
              <input
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={signupInfo.password}
                className="border-2 border-gray-300 rounded-md mb-3 p-2 focus:outline-none focus:ring-2 focus:ring-[#36A76F]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#36A76F] text-gray-100 font-semibold py-2 rounded-lg hover:bg-[#2e8b5e] transition"
            >
              Create account
            </button>
          </form>

          <p className="text-center text-[#FD9846] font-semibold mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#36A76F] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default SignupPage;
