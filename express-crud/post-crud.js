// Import necessary modules and models
import express from 'express';
import mongoose from 'mongoose';
import { User } from './path-to-your-model/User';
import { Post } from './path-to-your-model/Post';
import { Comment } from './path-to-your-model/Comment';

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new post
app.post('/posts', async (req, res) => {
  try {
    const { userId, content } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new post
    const newPost = new Post({
      user: userId,
      content,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name'); // Populate the 'user' field with the 'name' property
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add like to a post
app.post('/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: 'User has already liked the post' });
    }

    post.likes.push(userId);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add comment to a post
app.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = new Comment({
      user: userId,
      content,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get comments for a post
app.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId }).populate('user', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Share a post
app.post('/posts/:postId/share', async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user has already shared the post
    if (post.shares.includes(userId)) {
      return res.status(400).json({ error: 'User has already shared the post' });
    }

    post.shares.push(userId);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
