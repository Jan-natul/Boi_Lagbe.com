import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation যোগ করা হলো
import Footer from "../Components/Footer";
import UploadWidget from "../Components/UploadWidget"; 
import { UserContext } from "../context/UserContext";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const AddBook = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useContext(UserContext);

  
  const isEditMode = location.state && location.state.post;
  const existingPost = isEditMode ? location.state.post : null;

  const [postData, setPostData] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    description: "",
    price: "",
    transactionType: "resell", 
    image: "" 
  });

  const [imagePreview, setImagePreview] = useState("");


  useEffect(() => {
    if (isEditMode && existingPost) {
        setPostData({
            title: existingPost.title,
            author: existingPost.author,
            genre: existingPost.genre,
            location: existingPost.location,
            description: existingPost.description,
            price: existingPost.price || "",
            transactionType: existingPost.transactionType,
            image: existingPost.image
        });
        setImagePreview(existingPost.image.startsWith("http") ? existingPost.image : `https://boi-lagbe-com.onrender.com/images/${existingPost.image}`);
    }
  }, [isEditMode, existingPost]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setPostData({ ...postData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async () => {
    if (!postData.title || !postData.author || !postData.image) {
      return handleError("Title, Author and Image are required!");
    }
    if (postData.transactionType === "resell" && !postData.price) {
      return handleError("Price is required for Resell!");
    }

    try {
      const token = localStorage.getItem("token");
      let url = "https://boi-lagbe-com.onrender.com/api/posts/create";
      let method = "POST";

      if (isEditMode) {
          url = `https://boi-lagbe-com.onrender.com/api/posts/update/${existingPost._id}`;
          method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": token 
        },
        body: JSON.stringify(postData)
      });

      const result = await response.json();

      if (result.success) {
        handleSuccess(isEditMode ? "Book updated successfully!" : "Book added successfully!");
        setTimeout(() => {

           navigate(isEditMode ? "/profile" : `/post/${result.post._id}`); 
        }, 1000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("Something went wrong!");
    }
  };

  return (
    <>
      <div className="bg-gray-100 overflow-hidden min-h-screen">
        <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          
          <div className="col-span-1 flex justify-center md:justify-start">
            <img src="/boy3.png" alt="reading" className="w-70 h-auto object-contain" onError={(e) => e.target.src = "https://via.placeholder.com/300"}/>
          </div>

          <div className="md:col-span-3 pb-20">
            <div className="max-w-5xl bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold text-green-600 mb-6 font-Grandstander">
                 {isEditMode ? "Edit Book Details" : "Add a New Book"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                
                <div className="md:col-span-2 space-y-5">
                  {[
                    { label: "Title", name: "title" },
                    { label: "Author", name: "author" },
                    { label: "Genre", name: "genre" },
                    { label: "Location", name: "location" }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="text-green-600 font-semibold">{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={postData[field.name]}
                        onChange={handleChange}
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded mt-1 px-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-green-600 font-semibold">Description</label>
                    <textarea
                      name="description"
                      value={postData.description}
                      onChange={handleChange}
                      placeholder="Enter book description…"
                      className="w-full h-32 bg-gray-50 border border-gray-300 rounded mt-1 p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-8">

                  <div>
                    <h3 className="text-green-600 font-semibold mb-2">Transaction Type</h3>
                    <div className="space-y-2 text-orange-500 font-medium">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="transactionType" 
                          value="resell"
                          checked={postData.transactionType === "resell"}
                          onChange={handleChange}
                        /> Resell
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="transactionType" 
                          value="exchange"
                          checked={postData.transactionType === "exchange"}
                          onChange={handleChange} 
                        /> Exchange
                      </label>
                    </div>
                  </div>

                  {postData.transactionType === "resell" && (
                    <div>
                      <label className="text-green-600 font-semibold">Price (Tk)</label>
                      <input
                        type="number"
                        name="price"
                        value={postData.price}
                        onChange={handleChange}
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded mt-1 px-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Enter price"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-green-600 font-semibold mb-2 block">Book Image</label>
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden rounded-lg">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">No image selected</span>
                      )}
                      <div className="absolute bottom-2 right-2">
                        <UploadWidget onUpload={handleImageUpload} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-10">
                <button 
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-10 py-3 rounded-full text-lg shadow-lg hover:bg-green-700 transition font-bold"
                >
                  {isEditMode ? "Update Post" : "Publish Post"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default AddBook;