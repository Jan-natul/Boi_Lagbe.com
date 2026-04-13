const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const http = require('http'); 
const { Server } = require('socket.io'); 


const MessageModel = require('./Models/message'); 
const NotificationModel = require('./Models/notification');
const ConversationModel = require('./Models/conversetion'); 
const UserModel = require('./Models/user'); 

const AuthRouter = require('./Routes/AuthRouter');
const UserRouter = require('./Routes/UserRouter');
const PostRouter = require('./Routes/PostRouter');
const ChatreqRouter = require('./Routes/ChatreqRouter'); 

require('dotenv').config();
require('./Models/db');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());


app.use('/auth', AuthRouter);
app.use('/user', UserRouter); 
app.use("/api/posts", PostRouter);
app.use('/api/chat-request', ChatreqRouter);
app.use('/images', express.static(path.join(__dirname, 'public/images')));


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (userId) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });

    socket.on("send_message", async (data) => {
        
        const { senderId, receiverId, text, conversationId } = data; 

        try {
            
            const newMessage = new MessageModel({
                conversationId: conversationId, 
                sender: senderId,
                receiver: receiverId,
                text: text
            });
            await newMessage.save();

           
            let isPending = false;
            if (conversationId) {
                const conversation = await ConversationModel.findById(conversationId);
                if (conversation) {
                    conversation.updatedAt = new Date();
                    conversation.lastMessage = text; 
                    await conversation.save();
                    
                    if(conversation.status === 'pending') {
                        isPending = true;
                    }
                }
            }

            io.to(receiverId).emit("receive_message", data);
            io.to(senderId).emit("receive_message", data);
  
            const sender = await UserModel.findById(senderId);
            
            const notificationMsg = isPending 
                ? `${sender.username} sent you a message request.` 
                : `${sender.username} messaged you.`;

            const newNotif = new NotificationModel({
                userId: receiverId,
                senderId: senderId,
                message: notificationMsg,
                type: isPending ? 'chat_request' : 'message', 
                isRead: false
            });
            await newNotif.save();

            io.to(receiverId).emit("new_notification", {
                _id: newNotif._id,
                message: notificationMsg,
                type: isPending ? 'chat_request' : 'message',
                time: new Date()
            });

        } catch (err) {
            console.error("Socket Error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});