const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('notifications', NotificationSchema);