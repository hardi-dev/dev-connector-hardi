const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route       GET api/profile/me
// @desc        Get Loged In User
// @access      Private
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


// @route       GET api/profile/me
// @desc        Get Loged In User 
// @access      Private
router.post('/', [ auth, [
  check('status', 'Status is Required').not().isEmpty(),
  check('skills', 'Skills are Required').not().isEmpty()
]], async (req, res) => {

  try {


    const errors = validationResult(req);
    if( !errors.isEmpty() ) {

      return res.status(400).json({
  
        errors: errors.array()
  
      })
  
    }

    const { 
      company,
      location,
      website,
      status,
      skills,
      bio,
      githubusername,
      experience,
      education,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // Build Profile Object
    const profileFileds = {};
    profileFileds.user = req.user.id;
    if( company ) profileFileds.company = company;
    if( location ) profileFileds.location = location;
    if( website ) profileFileds.website = website;
    if( status ) profileFileds.status = status;
    if( bio ) profileFileds.bio = bio;
    if( githubusername ) profileFileds.githubusername = githubusername;
    if( skills ) {
      profileFileds.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build Social Object
    profileFileds.social = {};
    if( twitter ) profileFileds.social.twitter = twitter;
    if( facebook ) profileFileds.social.facebook = facebook;
    if( linkedin ) profileFileds.social.linkedin = linkedin;
    if( instagram ) profileFileds.social.instagram = instagram;
    if( youtube ) profileFileds.social.youtube = youtube;

    try {
      
      let profile = await Profile.findOne({ user: req.user.id });

      if( profile ) {

        // Update User Profile if Exists
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFileds },
          { new: true }
        )

        return res.json(profile);

      }


      // Create New One if new 
      profile = new Profile(profileFileds);

      await profile .save();

      res.json(profile);


    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error")
    }


    res.send("halo");


    

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})



module.exports = router;