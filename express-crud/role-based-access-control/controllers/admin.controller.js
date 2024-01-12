// controllers/AdminController.js
export const AdminController = {
    getDashboard: (req, res) => {
      // Access admin data
      if (req.userId) {
        // Fetch admin data from the database
        const adminData = {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        };
  
        res.json(adminData);
      } else {
        res.status(404).json({ error: 'Admin not found' });
      }
    },
  };
  