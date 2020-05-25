const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select('-passowrd');
    res.json(user);

  } catch (error) {
    
    console.error(error.message); 
    res.status(500).send('Server Error');

  }
});

module.exports = router;