const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('All fields are required!');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.send('User signed up successfully!');
  } catch (err) {
    res.send('Error: User already exists!');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.send('User not found!');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send('Invalid credentials!');

  req.session.userId = user._id;
  res.send('Logged in successfully!');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully!');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.send('Please log in first.');
  res.send('Welcome to the dashboard!');
});

module.exports = router;


//auth. routes file