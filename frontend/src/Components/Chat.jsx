import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext"; 
import Swal from 'sweetalert2';

const socket = io.connect("http://localhost:8080");

const Chat = ({ onClose, receiverName, receiverId }) => {
  const { user } = useContext(UserContext);
  
  const [conversation, setConversation] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("loading");
  const scrollRef = useRef(null);

  
  useEffect(() => {
    if (user && user._id) {
      socket.emit("join_room", user._id);
      checkStatusAndFetchMessages();
    }
  }, [user, receiverId]);

  
  const checkStatusAndFetchMessages = async () => {
    try {
        const token = localStorage.getItem('token'); 
        
        const statusRes = await fetch(`http://localhost:8080/api/chat-request/status/${user._id}/${receiverId}`, {
             headers: { 'Authorization': token }
        });
        const statusData = await statusRes.json();

        if (statusData.success) {
            
            if (statusData.status === 'new') {
                setChatStatus("new");
                setConversation(null);
                setMessageList([]);
                return;
            }

            setConversation(statusData.conversation);

           
            if (statusData.status === 'blocked') {
                if (statusData.blockedBy && statusData.blockedBy !== user._id) {
                    setChatStatus("not_found"); 
                    return; 
                } else {
                    setChatStatus("blocked_by_me");
                }
            } 
          
            else {
                setChatStatus("active");
            }

            if (statusData.status !== 'blocked' || statusData.blockedBy === user._id) {
                const msgRes = await fetch(`http://localhost:8080/api/chat-request/messages/${user._id}/${receiverId}`, { // ⚠️ Note: রাউট যদি messages হয়
                    headers: { 'Authorization': token }
                });
                const msgData = await msgRes.json();
                if (msgData.success) {
                    setMessageList(msgData.messages);
                }
            }
        }
    } catch (err) {
        console.error("Error fetching chat data:", err);
    }
  };
useEffect(() => {
    const handleReceiveMessage = (data) => {
        const isMyChat = (data.senderId === receiverId && data.receiverId === user._id) || 
                         (data.senderId === user._id && data.receiverId === receiverId);

        if (isMyChat) {
             setMessageList((list) => [...list, data]);

        
             if (!conversation || conversation.status === 'new') {
                 checkStatusAndFetchMessages();
             }
        }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [receiverId, user._id, conversation]); 

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

 
  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;

    
    if (chatStatus === 'blocked_by_me' || chatStatus === 'not_found') return;

    try {
        let currentConvoId = conversation?._id;

        if (!conversation || chatStatus === 'new') {
            const token = localStorage.getItem('token');
            const initRes = await fetch("http://localhost:8080/api/chat-request/initiate", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": token 
                },
                body: JSON.stringify({ senderId: user._id, receiverId: receiverId })
            });
            const initData = await initRes.json();
            
            if (initData.success) {
                setConversation(initData.conversation);
                currentConvoId = initData.conversation._id;
                setChatStatus("active"); 
            } else {
                console.error("Failed to initiate chat");
                return;
            }
        }

        const messageData = {
            conversationId: currentConvoId,
            senderId: user._id,
            receiverId: receiverId,
            text: currentMessage,
        };

       
        await socket.emit("send_message", messageData);
        
       
        setCurrentMessage("");

    } catch (err) {
        console.error("Sending failed:", err);
    }
  };

  
  const handleAction = async (action) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/chat-request/action`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token 
            },
            body: JSON.stringify({ 
                conversationId: conversation._id, 
                action: action,
                userId: user._id 
            })
        });
        const data = await res.json();
        
        if (data.success) {
            setConversation(data.conversation);
            if (action === 'accepted') setChatStatus("active");
            
            if (action === 'rejected') {
               
                onClose();
            }
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleBlock = () => {
    Swal.fire({
      title: `Block ${receiverName}?`,
      text: "You won't receive messages from them.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Block!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleAction('blocked');
        setChatStatus("blocked_by_me");
      }
    });
  };

 
  if (chatStatus === "not_found") {
    return (
      <div className="fixed bottom-10 right-10 z-50 animate-fade-in-up">
        <div className="w-[350px] bg-white rounded-xl border-2 border-gray-300 shadow-2xl h-[200px] flex flex-col justify-center items-center p-5 text-center">
           <div className="text-4xl mb-3">😕</div>
           <h3 className="text-lg font-bold text-gray-700">Message unavailable</h3>
           <p className="text-sm text-gray-500">You cannot reply to this conversation.</p>
           <button onClick={onClose} className="mt-4 bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300 font-bold">Close</button>
        </div>
      </div>
    );
  }

 
  const showRequestButtons = conversation?.status === 'pending' && String(conversation?.initiator) !== String(user._id);

  
  const showPendingMessage = conversation?.status === 'pending' && String(conversation?.initiator) === String(user._id);
  
  
  const isInputDisabled = showRequestButtons || chatStatus === 'blocked_by_me';
  return (
    <div className="fixed bottom-10 right-10 z-50 animate-fade-in-up">
      <div className="w-[350px] bg-gray-100 rounded-xl border-2 border-green-600 shadow-2xl overflow-hidden flex flex-col h-[450px] relative">
        
       
        <div className="bg-gray-200 px-3 py-2 flex justify-between items-center border-b border-gray-300 z-10">
          <button onClick={handleBlock} title="Block" className="w-7 h-7 flex items-center rounded-2xl justify-center transition-all">
            <img src="/block.png" alt="" className="w-full h-full object-contain rounded-lg"  />
          </button>
          <h3 className="font-bold text-gray-800 text-sm">{receiverName}</h3>
          <button onClick={onClose}  title="Close" className="w-7 h-7 flex items-center rounded-2xl justify-center transition-all">
            <img src="/delete.png" alt="" className="w-full h-full object-contain rounded-lg" />
          </button>
        </div>

        {showRequestButtons && (
            <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-white p-5 text-center mt-10 backdrop-blur-sm">
                <p className="mb-6 text-lg font-semibold">Message Request from <br/><span className="text-orange-400">{receiverName}</span></p>
                <div className="flex gap-4">
                    <button onClick={() => handleAction('accepted')} className="bg-green-600 px-6 py-2 rounded-full font-bold">Accept</button>
                    <button onClick={() => handleAction('rejected')} className="bg-red-500 px-6 py-2 rounded-full font-bold">Reject</button>
                </div>
            </div>
        )}

        {showPendingMessage && (
             <div className="bg-yellow-100 p-2 text-center text-xs text-yellow-800 border-b border-yellow-200">
                Your message request is pending. They can't see your new messages until they accept.
             </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white scrollbar-thin scrollbar-thumb-gray-300">
          {messageList.map((msg, index) => {
             const isMe = msg.senderId === user._id;
             return (
                <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-2 rounded-xl text-sm shadow-sm max-w-[80%] break-words ${
                        isMe ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}>
                        <p>{msg.text}</p>
                    </div>
                </div>
             );
          })}
          <div ref={scrollRef} />
        </div>

        <div className="p-3 bg-gray-200 flex items-center gap-2 border-t border-gray-200">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => { e.key === "Enter" && !isInputDisabled && sendMessage(); }}
            placeholder={isInputDisabled ? "Waiting for accept..." : "Type a message..."} 
            disabled={isInputDisabled}
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
          />
          <button onClick={sendMessage} disabled={isInputDisabled} className="w-8 h-8 flex items-center justify-center">
             <img src="/send.png" alt="" className="w-full h-full object-contain rounded-lg" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;