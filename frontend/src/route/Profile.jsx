import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import Card from "../components/Card";
import Footer from "../components/Footer";
import Chat from "../components/Chat"; 
import { UserContext } from "../context/UserContext";
import io from "socket.io-client";
import moment from "moment";
import Swal from 'sweetalert2'; 

const socket = io.connect("http://localhost:8080");

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("myPosts");
  const [myPosts, setMyPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]); 
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const { user, logoutUser } = useContext(UserContext);
  const [savedPostsData, setSavedPostsData] = useState([]);

const fetchSavedPosts = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/user/saved-posts`, {
            headers: { 'Authorization': token }
        });
        const result = await response.json();
        if (result.success) {
            setSavedPostsData(result.savedPosts);
        }
    } catch (err) {
        console.error("Failed to fetch saved posts", err);
    }
};

useEffect(() => {
    if (activeTab === 'saved') {
        fetchSavedPosts();
    }
}, [activeTab]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchMyPosts();
      fetchConversations(); 

      if (user._id) {
        socket.emit("join_room", user._id);
      }
    }
  }, [user, navigate]);

  
  useEffect(() => {
    const handleNewNotification = (data) => {
      setNotifications((prev) => [data, ...prev]);
    };

    const handleMessageUpdate = () => {
       fetchConversations();
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("receive_message", handleMessageUpdate);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("receive_message", handleMessageUpdate);
    };
  }, []);
  

  const fetchMyPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/user/${user._id}`);
      const result = await response.json();
      if (result.success) {
        setMyPosts(result.posts);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const fetchConversations = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/chat-request/conversations/list`, {
           headers: { 'Authorization': token }
        });
        const result = await response.json();
        if (result.success) {
            setConversations(result.conversations);
        }
    } catch (err) {
        console.error("Failed to fetch conversations", err);
    }
  };

  const handleEdit = (post) => {
      navigate('/add', { state: { post: post } }); 
  };
  const handleDelete = async (postId) => {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:8080/api/posts/delete/${postId}`, {
                      method: 'DELETE',
                      headers: { 'Authorization': token }
                  });
                  const result = await response.json();
                  if (result.success) {
                      setMyPosts(myPosts.filter(p => p._id !== postId));
                      Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
                  }
              } catch (err) {
                  console.error(err);
              }
          }
      });
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will lose all your posts and data permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete my account!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch("http://localhost:8080/user/delete-account", {
            method: "DELETE",
            headers: {
              "Authorization": token
            }
          });

          const result = await response.json();

          if (result.success) {
            Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
            logoutUser(); 
            navigate('/login');
          } else {
            Swal.fire('Error!', result.message, 'error');
          }
        } catch (err) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8 font-sans text-[#2B2B2B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
  
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 flex flex-col items-center sticky top-24">
              <div className="w-32 h-32 rounded-full border-2 border-orange-400 mb-4 overflow-hidden relative bg-gray-50">
                <img
                  src={
                    user.profilePic
                      ? (user.profilePic.startsWith("http") ? user.profilePic : `http://localhost:8080/images/${user.profilePic}`)
                      : "/noavatar.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.onerror = null; e.target.src = "/noavatar.png";}}
                />
              </div>
              <h2 className="text-xl font-bold font-Grandstander text-green-600">{user.username}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>
          
              <div className="w-full flex justify-between border-t border-b border-gray-200 py-4 mb-6">
                <div className="text-center w-1/2 border-r border-gray-300">
                  <span className="block text-xl font-bold text-orange-400">{myPosts.length}</span>
                  <span className="text-xs text-gray-500 uppercase">Posts</span>
                </div>
                <div className="text-center w-1/2">
                  <span className="block text-xl font-bold text-orange-400">{savedPostsData.length}</span>
                  <span className="text-xs text-gray-500 uppercase">Saved</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                 <Link to="/update" className="block w-full">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-semibold shadow-sm">
                Update Profile
                </button>
            </Link>
            <button 
            onClick={handleDeleteAccount}
            className="w-full bg-white border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white py-2 rounded-lg transition font-semibold"
        >
            Delete Account
        </button>
                <button onClick={handleLogout} className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg transition font-semibold mt-4">Logout</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">

            <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-2 mb-6 flex flex-wrap gap-2">
              <button onClick={() => setActiveTab("myPosts")} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${activeTab === "myPosts" ? "bg-orange-400 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>My Posts 📚</button>
              <button onClick={() => setActiveTab("messages")} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${activeTab === "messages" ? "bg-orange-400 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>Messages 💬</button>
              <button onClick={() => setActiveTab("saved")} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${activeTab === "saved" ? "bg-orange-400 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>Saved ❤️</button>
              <button onClick={() => setActiveTab("notifications")} className={`flex-1 py-2 px-4 rounded-lg font-semibold transition relative ${activeTab === "notifications" ? "bg-orange-400 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>
                Notifications 🔔
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{notifications.length}</span>
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 min-h-[500px]">

               {activeTab === "myPosts" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 font-Grandstander">My Published Books</h3>
                    <Link to="/add">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                        <span>+</span> Create Post
                      </button>
                    </Link>
                  </div>
                  
                  {myPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myPosts.map((book) => (
                        <div key={book._id} className="relative group">
                           
                            <Card book={{...book, type: book.transactionType, price: book.price}} />
                            
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                <button 
                                    onClick={() => handleEdit(book)}
                                    className=" text-white"
                                    title="Edit"
                                >
                                <img src="/edit.png" alt="" className="w-10 h-10 object-cover rounded-xl hover:scale-107" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(book._id)}
                                    className=" text-white "
                                    title="Delete"
                                >
                                <img src="/delete.png" alt="" className="w-10 h-10 object-cover rounded-xl hover:scale-107"  />
                                </button>
                            </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center mt-10">You haven't posted any books yet.</p>
                  )}
                </div>
              )}

              {activeTab === "messages" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 font-Grandstander mb-6">Inbox</h3>
                  
                  <div className="flex flex-col space-y-3">
                    {conversations.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">No conversations yet.</p>
                    ) : (
                        conversations.map((convo) => (
                        <div 
                            key={convo._id} 
                            onClick={() => setSelectedChatUser({ id: convo.userDetails._id, name: convo.userDetails.username })}
                            className="flex items-center p-4 bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-xl transition duration-200 cursor-pointer shadow-sm group"
                        >

                                <div className="relative">
                                    <img 
                                        src={
                                            convo.userDetails.profilePic 
                                            ? (convo.userDetails.profilePic.startsWith("http") ? convo.userDetails.profilePic : `http://localhost:8080/images/${convo.userDetails.profilePic}`)
                                            : "/noavatar.png"
                                        }
                                        alt={convo.userDetails.username}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:border-orange-200 transition"
                                        onError={(e) => {e.target.onerror = null; e.target.src = "/noavatar.png";}}
                                    />
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>

                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">
                                            {convo.userDetails.username}
                                        </h4>
                                        <span className="text-xs text-gray-400">
                                            {moment(convo.updatedAt).fromNow()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm truncate max-w-[200px] md:max-w-md">
                                        {convo.lastMessage}
                                    </p>
                                </div>

                                <div className="ml-2 text-gray-300 group-hover:text-orange-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                        </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
    <div>
        <h3 className="text-2xl font-bold text-gray-800 font-Grandstander mb-6">Saved Posts</h3>
        {savedPostsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPostsData.map((book) => (
            <Card 
                key={book._id} 
                book={{...book, type: book.transactionType, price: book.price}} 
            />
            ))}
        </div>
        ) : (
        <p className="text-gray-500 text-center mt-10">You haven't saved any posts yet.</p>
        )}
    </div>
)}

              {activeTab === "notifications" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 font-Grandstander mb-6">Notifications</h3>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No new notifications</p>
                    ) : (
                        notifications.map((notif, index) => (
                        <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400 hover:bg-orange-50 transition shadow-sm animate-fade-in-up">
                            <div className="mr-4 text-xl">📩</div>
                            <div>
                            <p className="text-gray-800 font-medium">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">Just now</p>
                            </div>
                        </div>
                        ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {selectedChatUser && (
        <Chat 
            receiverId={selectedChatUser.id} 
            receiverName={selectedChatUser.name} 
            onClose={() => setSelectedChatUser(null)} 
        />
      )}

      <Footer />
    </>
  );
};

export default ProfilePage;