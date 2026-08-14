import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { UserContext } from "../context/UserContext";
import Swal from "sweetalert2";

const socket = io.connect("http://localhost:8080");

const Chat = ({ onClose, receiverName, receiverId }) => {
  const { user } = useContext(UserContext);

  const [conversation, setConversation] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("loading");

  const scrollRef = useRef(null);

  // =========================================================
  // ID helper
  // =========================================================
  const getId = (value) => {
    if (!value) return "";

    // যদি ObjectId / object হয়
    if (typeof value === "object") {
      if (value._id) return String(value._id);
      if (value.id) return String(value.id);
    }

    return String(value);
  };

  // =========================================================
  // Normalize message
  // =========================================================
  const normalizeMessage = (msg) => {
    const senderId = getId(msg.senderId || msg.sender);
    const receiverId = getId(msg.receiverId || msg.receiver);

    return {
      ...msg,
      senderId,
      receiverId,
    };
  };

  // =========================================================
  // Join socket room + fetch chat
  // =========================================================
  useEffect(() => {
    if (!user?._id || !receiverId) return;

    const currentUserId = getId(user._id);
    const otherUserId = getId(receiverId);

    console.log("=================================");
    console.log("CHAT OPENED");
    console.log("CURRENT USER ID:", currentUserId);
    console.log("RECEIVER ID:", otherUserId);
    console.log("=================================");

    socket.emit("join_room", currentUserId);

    checkStatusAndFetchMessages();
  }, [user?._id, receiverId]);

  // =========================================================
  // Fetch conversation + messages
  // =========================================================
  const checkStatusAndFetchMessages = async () => {
    if (!user?._id || !receiverId) return;

    try {
      const token = localStorage.getItem("token");

      const currentUserId = getId(user._id);
      const otherUserId = getId(receiverId);

      // -----------------------------
      // Get chat status
      // -----------------------------
      const statusRes = await fetch(
        `http://localhost:8080/api/chat-request/status/${currentUserId}/${otherUserId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const statusData = await statusRes.json();

      console.log("STATUS DATA:", statusData);

      if (!statusData.success) {
        console.error("Status request failed:", statusData);
        return;
      }

      // -----------------------------
      // New conversation
      // -----------------------------
      if (statusData.status === "new") {
        setChatStatus("new");
        setConversation(null);
        setMessageList([]);
        return;
      }

      // -----------------------------
      // Set conversation
      // -----------------------------
      setConversation(statusData.conversation);

      // -----------------------------
      // Blocked
      // -----------------------------
      if (statusData.status === "blocked") {
        const blockedBy = getId(statusData.blockedBy);

        if (blockedBy && blockedBy !== currentUserId) {
          setChatStatus("not_found");
          return;
        } else {
          setChatStatus("blocked_by_me");
        }
      } else {
        setChatStatus("active");
      }

      // -----------------------------
      // Fetch messages
      // -----------------------------
      if (
        statusData.status !== "blocked" ||
        getId(statusData.blockedBy) === currentUserId
      ) {
        const msgRes = await fetch(
          `http://localhost:8080/api/chat-request/messages/${currentUserId}/${otherUserId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const msgData = await msgRes.json();

        console.log("=================================");
        console.log("RAW MESSAGE DATA:", msgData);
        console.log("CURRENT USER ID:", currentUserId);
        console.log("RECEIVER ID:", otherUserId);
        console.log("=================================");

        if (msgData.success && Array.isArray(msgData.messages)) {
          const normalizedMessages = msgData.messages.map((msg) => {
            const normalized = normalizeMessage(msg);

            console.log("MESSAGE CHECK:", {
              text: normalized.text,
              senderId: normalized.senderId,
              receiverId: normalized.receiverId,
              currentUserId: currentUserId,
              isMine: normalized.senderId === currentUserId,
            });

            return normalized;
          });

          setMessageList(normalizedMessages);
        } else {
          setMessageList([]);
        }
      }
    } catch (err) {
      console.error("Error fetching chat data:", err);
    }
  };

  // =========================================================
  // Receive real-time messages
  // =========================================================
  useEffect(() => {
    if (!user?._id || !receiverId) return;

    const handleReceiveMessage = (data) => {
      const currentUserId = getId(user._id);
      const otherUserId = getId(receiverId);

      const message = normalizeMessage(data);

      console.log("=================================");
      console.log("SOCKET MESSAGE RECEIVED");
      console.log("TEXT:", message.text);
      console.log("SENDER:", message.senderId);
      console.log("RECEIVER:", message.receiverId);
      console.log("CURRENT USER:", currentUserId);
      console.log("=================================");

      const isMyChat =
        (message.senderId === currentUserId &&
          message.receiverId === otherUserId) ||
        (message.senderId === otherUserId &&
          message.receiverId === currentUserId);

      if (!isMyChat) {
        return;
      }

      // Prevent duplicate message
      setMessageList((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (msg) =>
            msg._id &&
            message._id &&
            String(msg._id) === String(message._id)
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });

      // If conversation was new, refresh status
      if (!conversation || conversation.status === "new") {
        checkStatusAndFetchMessages();
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user?._id, receiverId, conversation]);

  // =========================================================
  // Auto scroll
  // =========================================================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messageList]);

  // =========================================================
  // Send message
  // =========================================================
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    if (
      chatStatus === "blocked_by_me" ||
      chatStatus === "not_found"
    ) {
      return;
    }

    try {
      const currentUserId = getId(user._id);
      const otherUserId = getId(receiverId);

      let currentConvoId = conversation?._id;

      // ---------------------------------
      // Create conversation if needed
      // ---------------------------------
      if (!conversation || chatStatus === "new") {
        const token = localStorage.getItem("token");

        const initRes = await fetch(
          "http://localhost:8080/api/chat-request/initiate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              senderId: currentUserId,
              receiverId: otherUserId,
            }),
          }
        );

        const initData = await initRes.json();

        console.log("INIT CHAT:", initData);

        if (!initData.success) {
          console.error("Failed to initiate chat");
          return;
        }

        setConversation(initData.conversation);

        currentConvoId = initData.conversation._id;

        setChatStatus("active");
      }

      // ---------------------------------
      // Message data
      // ---------------------------------
      const messageData = {
        conversationId: currentConvoId,
        senderId: currentUserId,
        receiverId: otherUserId,
        text: currentMessage.trim(),
      };

      console.log("SENDING MESSAGE:", messageData);

      socket.emit("send_message", messageData);

      setCurrentMessage("");
    } catch (err) {
      console.error("Sending failed:", err);
    }
  };

  // =========================================================
  // Accept / Reject / Block
  // =========================================================
  const handleAction = async (action) => {
    if (!conversation?._id) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8080/api/chat-request/action",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            conversationId: conversation._id,
            action: action,
            userId: getId(user._id),
          }),
        }
      );

      const data = await res.json();

      console.log("CHAT ACTION:", data);

      if (data.success) {
        setConversation(data.conversation);

        if (action === "accepted") {
          setChatStatus("active");

          // Reload messages
          checkStatusAndFetchMessages();
        }

        if (action === "rejected") {
          onClose();
        }

        if (action === "blocked") {
          setChatStatus("blocked_by_me");
        }
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  // =========================================================
  // Block
  // =========================================================
  const handleBlock = () => {
    Swal.fire({
      title: `Block ${receiverName}?`,
      text: "You won't receive messages from them.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Block!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleAction("blocked");
      }
    });
  };

  // =========================================================
  // Message unavailable
  // =========================================================
  if (chatStatus === "not_found") {
    return (
      <div className="fixed bottom-10 right-10 z-50 animate-fade-in-up">
        <div className="w-[350px] bg-white rounded-xl border-2 border-gray-300 shadow-2xl h-[200px] flex flex-col justify-center items-center p-5 text-center">
          <div className="text-4xl mb-3">😕</div>

          <h3 className="text-lg font-bold text-gray-700">
            Message unavailable
          </h3>

          <p className="text-sm text-gray-500">
            You cannot reply to this conversation.
          </p>

          <button
            onClick={onClose}
            className="mt-4 bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // Request states
  // =========================================================
  const showRequestButtons =
    conversation?.status === "pending" &&
    getId(conversation?.initiator) !== getId(user?._id);

  const showPendingMessage =
    conversation?.status === "pending" &&
    getId(conversation?.initiator) === getId(user?._id);

  const isInputDisabled =
    showRequestButtons ||
    chatStatus === "blocked_by_me";

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="fixed bottom-10 right-10 z-50 animate-fade-in-up">
      <div className="w-[350px] bg-gray-100 rounded-xl border-2 border-green-600 shadow-2xl overflow-hidden flex flex-col h-[450px] relative">

        {/* Header */}
        <div className="bg-gray-200 px-3 py-2 flex justify-between items-center border-b border-gray-300 z-10">

          <button
            onClick={handleBlock}
            title="Block"
            className="w-7 h-7 flex items-center rounded-2xl justify-center transition-all"
          >
            <img
              src="/block.png"
              alt="Block"
              className="w-full h-full object-contain rounded-lg"
            />
          </button>

          <h3 className="font-bold text-gray-800 text-sm">
            {receiverName}
          </h3>

          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 flex items-center rounded-2xl justify-center transition-all"
          >
            <img
              src="/delete.png"
              alt="Close"
              className="w-full h-full object-contain rounded-lg"
            />
          </button>
        </div>

        {/* Message Request */}
        {showRequestButtons && (
          <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center text-white p-5 text-center mt-10 backdrop-blur-sm">

            <p className="mb-6 text-lg font-semibold">
              Message Request from
              <br />

              <span className="text-orange-400">
                {receiverName}
              </span>
            </p>

            <div className="flex gap-4">

              <button
                onClick={() => handleAction("accepted")}
                className="bg-green-600 px-6 py-2 rounded-full font-bold"
              >
                Accept
              </button>

              <button
                onClick={() => handleAction("rejected")}
                className="bg-red-500 px-6 py-2 rounded-full font-bold"
              >
                Reject
              </button>

            </div>
          </div>
        )}

        {/* Pending */}
        {showPendingMessage && (
          <div className="bg-yellow-100 p-2 text-center text-xs text-yellow-800 border-b border-yellow-200">
            Your message request is pending. They can't see your new messages until they accept.
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white scrollbar-thin scrollbar-thumb-gray-300">

          {messageList.map((msg, index) => {

            const currentUserId = getId(user?._id);
            const senderId = getId(msg.senderId);

            const isMe = senderId === currentUserId;

            console.log("RENDER MESSAGE:", {
              text: msg.text,
              senderId,
              currentUserId,
              isMe,
            });

            return (
              <div
                key={msg._id || index}
                className={`flex ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl text-sm shadow-sm max-w-[80%] break-words ${
                    isMe
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-gray-200 flex items-center gap-2 border-t border-gray-200">

          <input
            type="text"
            value={currentMessage}
            onChange={(e) =>
              setCurrentMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !isInputDisabled
              ) {
                sendMessage();
              }
            }}
            placeholder={
              isInputDisabled
                ? "Waiting for accept..."
                : "Type a message..."
            }
            disabled={isInputDisabled}
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={isInputDisabled}
            className="w-8 h-8 flex items-center justify-center"
          >
            <img
              src="/send.png"
              alt="Send"
              className="w-full h-full object-contain rounded-lg"
            />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Chat;