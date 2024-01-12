// middleware/auth.js
export const authenticateUser = (roles) => (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'your-secret-key');
      req.userId = decodedToken.userId;
  
      // Check if user has the required role
      if (!roles.includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
  