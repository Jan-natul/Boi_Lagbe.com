import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Footer from "../components/Footer";
import UploadWidget from "../components/UploadWidget"; 
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user, loginUser } = useContext(UserContext);

  const [imagePreview, setImagePreview] = useState("noavatar.png");


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePic: "" 
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        profilePic: user.profilePic || ""
      }));

      setImagePreview(user.profilePic ? user.profilePic : "noavatar.png");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleImageUpload = (url) => {
    setFormData({ ...formData, profilePic: url }); 
    setImagePreview(url); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!formData.oldPassword) {
      return handleError("Please enter your current password to save changes.");
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return handleError("New passwords do not match!");
    }

    try {
      
      const response = await fetch(`http://https://boi-lagbe-com.onrender.com/user/update/${user._id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData) 
      });

      const result = await response.json();

      if (result.success) {
  const updatedUserObj = {
    ...user,
    username: result.username || formData.username,
    email: result.email || formData.email,
    profilePic: formData.profilePic   // 👈 result থেকে না, formData থেকে নিন
  };

  loginUser(updatedUserObj);
  handleSuccess("Profile updated successfully!");

  setTimeout(() => {
    navigate("/profile");
  }, 1000);
}else {
        handleError(result.message);
      }

    } catch (err) {
      handleError("Failed to connect to server.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border-t-4 border-green-600">
          
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 font-Grandstander">
              Update Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your current password to confirm changes.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-3 border-orange-400 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = "noavatar.png"}}
                  />
                </div>
                
                <div className="absolute bottom-0 right-0">
                   <UploadWidget onUpload={handleImageUpload} />
                </div>
                
              </div>
              <p className="text-xs text-gray-400 mt-2">Use the camera icon to upload photo</p>
            </div>

            <div className="rounded-md shadow-sm space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="oldPassword"
                    type="password"
                    required
                    placeholder="Enter current password to save changes"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

              <div className="border-t border-gray-300 pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-3">Leave blank if you don't want to change password.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      />
                   </div>
                 </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-bold">Important Note:</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please write down your new password in a safe place immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-1/3 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-2/3 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none shadow-sm transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default UpdateProfile;