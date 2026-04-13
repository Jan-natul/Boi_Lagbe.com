const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,   
        default: "noavatar.png"
    },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'posts' }] 

}, { timestamps: true }
);

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
