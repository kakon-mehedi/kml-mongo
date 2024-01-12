// Import necessary modules and models
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from './path-to-your-model/User';
import { Product } from './path-to-your-model/Product';
import { Order } from './path-to-your-model/Order';

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Create a token for user authentication
    const token = jwt.sign({ userId: savedUser._id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a token for user authentication
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, 'your-secret-key');
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Create a product
app.post('/products', authenticateUser, async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Create a new product
    const newProduct = new Product({
      name,
      price,
      description,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Place an order
app.post('/orders', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create a new order
    const newOrder = new Order({
      user: req.userId,
      product: productId,
      quantity,
      total: product.price * quantity,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's orders
app.get('/orders', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('product', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
