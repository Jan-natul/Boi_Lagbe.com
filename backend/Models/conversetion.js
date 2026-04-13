const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending'
    },
    blockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    initiator: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true });

module.exports = mongoose.model('conversations', ConversationSchema);