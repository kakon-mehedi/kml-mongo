// Import necessary modules and models
import express from 'express';
import mongoose from 'mongoose';
import { User } from './path-to-your-model/User';

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users with pagination
app.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const users = await User.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search users by name
app.get('/users/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      name: { $regex: new RegExp(query, 'i') }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete users based on status
app.delete('/users/delete-by-status/:status', async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status parameter is required' });
    }

    const result = await User.deleteMany({ status });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No users found with the specified status' });
    }

    res.json({ message: `Successfully deleted ${result.deletedCount} users with status "${status}"` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// Create a user and notify if a user created 3 month ago 

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    // Schedule notification check after user creation
    scheduleNotificationCheck(savedUser._id);

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Function to schedule notification check
function scheduleNotificationCheck(userId) {
  // Schedule the job to run every day
  const job = schedule.scheduleJob('0 0 * * *', async () => {
    try {
      // Fetch the user
      const user = await User.findById(userId);

      // Check if the user was created three months ago
      if (user && isThreeMonthsAgo(user.createdAt)) {
        // Notify the user (replace 'YourNotificationService' with the actual service)
        YourNotificationService.notifyUser(user._id, 'You were created three months ago!');
      }
    } catch (error) {
      console.error('Error scheduling notification check:', error.message);
    }
  });
}

// Function to check if a date is three months ago
function isThreeMonthsAgo(date) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return date <= threeMonthsAgo;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
