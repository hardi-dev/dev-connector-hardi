const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

// Auth
router.get('/', auth, async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select('-passowrd');
    res.json(user);

  } catch (error) {
    
    console.error(error.message); 
    res.status(500).send('Server Error');

  }
});


// Authenticate User and get Token
router.post('/', [

  check('email', 'Please inculde a valid email').isEmail(),
  check('password', 'Password is Required').exists(),

], async (req, res) => {

  const errors = validationResult(req); 
  if( !errors.isEmpty() ) {

    return res.status(400).json({

      errors: errors.array()

    })

  }

  const { email, password } = req.body;

  try {

    // Check User Not Exists
    let user = await User.findOne({ email });
    
    if( !user ) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
    }

    // Check is Password Matched or not
    const isMatch = await bcrypt.compare(password, user.password);
    if( !isMatch ) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
    }

    // Return JSON Web Token
    const payload = {
      user : {
        id: user.id,
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: 360000  }, 
      (err, token) => {
        if( err ) throw err;
        res.json({ token })
      });
    


  } catch ( err ) {

    console.error(err.message);
    res.status(500).send('Server Error');

  }



});

module.exports = router;