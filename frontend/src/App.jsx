import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./route/Hompage";
import SignupPage from "./route/signuppage";
import LoginPage from "./route/loginpage";
import ProfilePage from "./route/Profile";
import ListPage from "./route/Listpage";
import Navbar from "./Components/Navbar";
import AddBook from "./route/Addbook";
import PostPage from "./route/Postpage";
import AboutH from "./route/AboutH";
import { ToastContainer } from "react-toastify";

// 1. UserProvider ইমপোর্ট করুন (পাথ ঠিক আছে কিনা চেক করবেন)
import { UserProvider } from "./context/UserContext"; 
import UpdateProfile from "./route/Updateprofile";

const App = () => {
  return (
    <div className="font-Grenze">
      
      {/* 2. UserProvider দিয়ে BrowserRouter কে ঘিরে দিন */}
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/about" element={<AboutH/>} />
            <Route path="/update" element={<UpdateProfile/>} />
          </Routes>
          <ToastContainer/>
        </BrowserRouter>
      </UserProvider>

    </div>
  );
};

export default App;