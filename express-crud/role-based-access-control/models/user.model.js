// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export const User = mongoose.model('User', userSchema);
