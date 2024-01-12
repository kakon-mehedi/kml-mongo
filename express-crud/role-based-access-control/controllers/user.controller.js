// controllers/UserController.js
export const UserController = {
    getProfile: (req, res) => {
      // Access user data based on the role
      if (req.userId) {
        // Fetch user data from the database
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        };
  
        res.json(userData);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    },
  };
  