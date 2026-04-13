const router = require('express').Router();
const ConversationModel = require('../Models/conversetion');
const MessageModel = require('../Models/message');
const ensureAuthenticated = require('../Middlewares/auth');

router.post('/initiate', ensureAuthenticated, async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new ConversationModel({
                participants: [senderId, receiverId],
                initiator: senderId, 
                status: 'pending'
            });
            await conversation.save();
        }

        if (conversation.status === 'blocked') {
            return res.status(200).json({ success: false, message: "Blocked", status: 'blocked', conversation });
        }

        res.status(200).json({ success: true, conversation });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// status check
router.get('/status/:senderId/:receiverId', ensureAuthenticated, async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            return res.status(200).json({ success: true, status: 'new', conversation: null });
        }

        res.status(200).json({ 
            success: true, 
            status: conversation.status,
            blockedBy: conversation.blockedBy,
            conversation 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//(accept / reject)
router.put('/action', ensureAuthenticated, async (req, res) => {
    try {
        const { conversationId, action, userId } = req.body; 
        
        let updateData = { status: action };
        
        if (action === 'blocked') {
            updateData.blockedBy = userId;
        }

        const updatedConv = await ConversationModel.findByIdAndUpdate(
            conversationId, 
            { $set: updateData }, 
            { new: true }
        );

        res.status(200).json({ success: true, conversation: updatedConv });
    } catch (err) {
        res.status(500).json(err);
    }
});

// message load
router.get('/messages/:user1/:user2', ensureAuthenticated, async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await MessageModel.find({
            conversationId: { $ne: null }, 
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (err) {
        res.status(500).json(err);
    }
});

// inbox List
router.get('/conversations/list', ensureAuthenticated, async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const conversations = await ConversationModel.find({
            participants: { $in: [currentUserId] }
        })
        .populate('participants', 'username profilePic email _id')
        .sort({ updatedAt: -1 });

        const formattedConversations = conversations.map(convo => {
            const otherUser = convo.participants.find(p => p._id.toString() !== currentUserId.toString());
            if (!otherUser) return null;

            return {
                _id: convo._id,
                lastMessage: convo.lastMessage || "Start chatting",
                updatedAt: convo.updatedAt,
                userDetails: otherUser,
                status: convo.status 
            };
        }).filter(i => i !== null);

        res.status(200).json({ success: true, conversations: formattedConversations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;