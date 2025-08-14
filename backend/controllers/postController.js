const Post = require('../models/Post');

// Create a post
exports.createPost = async (req, res) => {
  const { content } = req.body;

  try {
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    const post = new Post({
      user: userId,
      content,
      file: req.file ? `/uploads/${req.file.filename}` : null, // Save file path if uploaded
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ error: 'You already liked this post' });
    }

    post.likes.push(req.user.id);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in likePost:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in unlikePost:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};

//Add comment to post
exports.addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user info in comments
    const updatedPost = await post.populate('comments.user', 'username').execPopulate();

    res.status(201).json(updatedPost.comments);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};



// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the logged-in user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: post._id });s
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};