import React, { useState, useEffect, useContext, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom"; 
import Footer from "../Components/Footer";
import Chat from "../Components/Chat";
import { UserContext } from "../context/UserContext"; 

const PostPage = () => {
  const { id } = useParams(); 
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();

  const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null); 

  useEffect(() => {
    const fetchPostAndStatus = async () => {
      try {
        const response = await fetch(`https://boi-lagbe-com.onrender.com/api/posts/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setPost(result.post);
        }
        
        if (user) {
            const token = localStorage.getItem('token');
            const savedRes = await fetch(`https://boi-lagbe-com.onrender.com/user/is-saved/${id}`, {
                headers: { 'Authorization': token }
            });
            const savedData = await savedRes.json();
            if (savedData.success) {
                setIsSaved(savedData.isSaved);
            }
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndStatus();

    const handleClickOutside = (event) => {
        if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
            setShowShareMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [id, user]);

  const handleSaveToggle = async () => {
      if (!user) {
          alert("Please login to save posts!");
          return;
      }
      try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://boi-lagbe-com.onrender.com/user/save/${id}`, {
              method: 'PUT',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': token 
              }
          });
          const result = await response.json();
          if (result.success) {
              setIsSaved(result.isSaved); 
          }
      } catch (err) {
          console.error("Error saving post:", err);
      }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: post.title,
                text: `Check out this book: ${post.title}`,
                url: window.location.href,
            });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    } else {
        setShowShareMenu(!showShareMenu);
    }
  };

  const shareToSocial = (platform) => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this book: ${post.title}`);
      let shareUrl = "";

      if (platform === "facebook") {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === "whatsapp") {
          shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      } else if (platform === "twitter") {
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      }

      window.open(shareUrl, "_blank");
      setShowShareMenu(false);
  };

  const copyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
      setShowShareMenu(false);
  };

  const handleSendMessage = () => {
    if (!user) {
        navigate("/signup");
    } else {
        setShowChat(true);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!post) return <div className="text-center mt-20">Post not found!</div>;

  return (
    <>
    <div className="min-h-screen bg-gray-100 pt-10 pb-20 px-4 sm:px-6 text-[#2B2B2B]">

      <div className="max-w-5xl mx-auto p-4 sm:p-6 border-2 border-orange-400 rounded-2xl bg-[#fcf9c2] shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">

          {/* IMAGE - bigger now, no overlay */}
          <div className="w-full md:w-2/5 shrink-0">
            <img
              src={
                 post.image.includes("http") 
                 ? post.image 
                 : `https://boi-lagbe-com.onrender.com/images/${post.image}`
              }
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-md object-cover"
              onError={(e) => {e.target.src = "https://via.placeholder.com/300x400?text=No+Image"}}
            />
          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-3">

            {/* Save/Share row - top right, beside image, not on top of it */}
            <div className="flex justify-end gap-2 relative">
                <div className="relative">
                    <button 
                      onClick={handleShareClick}
                      className="p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition"
                      aria-label="Share"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>

                    {showShareMenu && (
                        <div ref={shareMenuRef} className="absolute top-11 right-0 bg-white border border-gray-200 shadow-xl rounded-lg p-2 w-48 z-50 flex flex-col space-y-2">
                            <button onClick={() => shareToSocial('facebook')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 font-bold">
                                <span className="text-blue-600">f</span> Facebook
                            </button>
                            <button onClick={() => shareToSocial('whatsapp')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 font-bold">
                                <span className="text-green-500">W</span> WhatsApp
                            </button>
                            <button onClick={() => shareToSocial('twitter')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 font-bold">
                                <span className="text-blue-400">X</span> Twitter
                            </button>
                            <hr />
                            <button onClick={copyLink} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 font-bold">
                                🔗 Copy Link
                            </button>
                        </div>
                    )}
                </div>

                <button 
                  onClick={handleSaveToggle}
                  className={`p-2.5 rounded-full text-white shadow-md transition
                      ${isSaved ? "bg-green-600 hover:bg-green-700" : "bg-orange-400 hover:bg-orange-500"}
                  `}
                  aria-label={isSaved ? "Saved" : "Save"}
                >
                  {isSaved ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                  )}
                </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#B45309] uppercase break-words">{post.title}</h1>

            <p className="text-lg pb-5 text-gray-700">By <span className="font-semibold">{post.author}</span></p>
            <p className="font-semibold text-l text-gray-900">Published by: <span className="font-normal text-green-700">{post.user ? post.user.username : "Unknown User"}</span></p>
            <p className="font-semibold text-l text-gray-900">Genre: <span className="font-normal">{post.genre}</span></p>
            <p className="font-semibold text-l text-gray-900">Location: <span className="font-normal">{post.location}</span></p>
            {post.transactionType === 'resell' && (<p className="font-bold text-2xl mt-3 text-gray-800">{post.price} Tk.</p>)}
            <div className="inline-block px-3 py-1 text-green-700 font-bold text-xl capitalize mt-2">{post.transactionType}</div>
            
            <div className="mt-5">
                <button 
                    onClick={handleSendMessage} 
                    className="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-xl shadow-md font-bold transition w-full md:w-auto"
                >
                Send Message
                </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-orange-300 pt-6">
          <h2 className="text-2xl font-bold text-[#B45309] mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.description}</p>
        </div>
      </div>

      {showChat && (
        <Chat onClose={() => setShowChat(false)} receiverName={post.user ? post.user.username : "Seller"} receiverId={post.user ? post.user._id : null} />
      )}
    </div>
    <Footer/>
    </>
  );
};

export default PostPage;