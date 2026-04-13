const router = require('express').Router();
const bcrypt = require('bcrypt');
const UserModel = require('../Models/user');
const PostModel = require('../Models/post'); 
const ensureAuthenticated = require('../Middlewares/auth'); 


router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, username, email, profilePic } = req.body;
        
      
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

       
        if (!oldPassword) {
            return res.status(400).json({ message: "Please provide current password", success: false });
        }
        const isPassEqual = await bcrypt.compare(oldPassword, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Current password is incorrect", success: false });
        }

      
        let updateData = {
            username: username || user.username,
            email: email || user.email
        };

    
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        if (profilePic) {
            updateData.profilePic = profilePic; 
        }

       
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            $set: updateData
        }, { new: true });

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
});

router.put('/save/:postId', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;
        const user = await UserModel.findById(userId);
        if (user.savedPosts.includes(postId)) {            
            user.savedPosts.pull(postId);
            await user.save();
            return res.status(200).json({ success: true, message: "Post unsaved", isSaved: false });
        } else {            
            user.savedPosts.push(postId);
            await user.save();
            return res.status(200).json({ success: true, message: "Post saved", isSaved: true });
        }

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/saved-posts', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await UserModel.findById(userId).populate('savedPosts');
        const savedPosts = user.savedPosts.reverse();
        res.status(200).json({ success: true, savedPosts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/is-saved/:postId', ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        const isSaved = user.savedPosts.includes(req.params.postId);
        res.status(200).json({ success: true, isSaved });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/delete-account', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        await PostModel.deleteMany({ user: userId });
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ 
            success: true, 
            message: "Account and all associated data deleted successfully" 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
});

module.exports = router;