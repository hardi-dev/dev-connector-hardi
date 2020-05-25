const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Get Profile
// Private
router.get('/me', auth, async (req, res) => {
  try {
    
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatr']);

    // Check Profile Is Not Exists
    if( !profile ) {
      return res.status(400).json({ errors: [{ msg: 'There are no Profile for this user '}] });
    }


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});

module.exports = router;