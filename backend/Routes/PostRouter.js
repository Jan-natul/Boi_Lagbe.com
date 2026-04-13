const router = require('express').Router();
const PostModel = require('../Models/post'); 
const ensureAuthenticated = require('../Middlewares/auth'); 

// post create route
router.post("/create", ensureAuthenticated, async (req, res) => {
  try {
    const {
      title,
      author,
      genre,
      location,
      description,
      transactionType,
      price,
      image, 
    } = req.body;

    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newPost = new PostModel({
      title,
      author,
      genre,
      location,
      description,
      transactionType: transactionType.toLowerCase(), 
      
      price: transactionType.toLowerCase() === "resell" ? price : null,
      image,
      user: req.user._id, 
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
});

// get post route
router.get("/", async (req, res) => {
    try {
        const { title, author, genre, location } = req.query; 
        
        let query = {};
        if (title) {
            query.title = { $regex: title, $options: "i" };
        }

        if (author) {
            query.author = { $regex: author, $options: "i" };
        }

        if (genre) {
            query.genre = { $regex: genre, $options: "i" };
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        const posts = await PostModel.find(query)
            .populate("user", "username profilePic") 
            .sort({ createdAt: -1 }); 
            
        res.status(200).json({ success: true, count: posts.length, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// specific post get
router.get("/:id", async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
            .populate("user", "username email profilePic"); 
            
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/user/:userId", async (req, res) => {
    try {
        const posts = await PostModel.find({ user: req.params.userId })
            .populate("user", "username profilePic") 
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/update/:id", ensureAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id;
        const updateData = req.body;
        
        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        if (post.user.toString() !== req.user._id) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, { new: true });
        res.status(200).json({ success: true, message: "Post updated successfully", post: updatedPost });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// delete post 
router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
    try {
        const postId = req.params.id;
        
        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        if (post.user.toString() !== req.user._id) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await PostModel.findByIdAndDelete(postId);
        res.status(200).json({ success: true, message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;