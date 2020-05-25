const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');


router.post('/', [

  check('name', 'Name is Required').not().isEmpty(), 
  check('email', 'Please inculde a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more character').isLength({ min: 6})

], async (req, res) => {

  const errors = validationResult(req); 
  if( !errors.isEmpty() ) {

    return res.status(400).json({

      errors: errors.array()

    })

  }

  const { name, email, password } = req.body;

  try {

    // Check if User Exists
    let user = await User.findOne({ email });
    
    if( user ) {
      return res.status(400).json({ errors: [{ msg: 'User already exists'}] });
    }

    // Get User Gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm' 
    })

    // Instance New User Object
    user = new User({ name, email, password, avatar })

    // Encrypt Password with bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save User
    await user.save();

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