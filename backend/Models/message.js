const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'conversations'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('messages', MessageSchema);