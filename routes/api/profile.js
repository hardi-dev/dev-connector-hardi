const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {
  check,
  validationResult
} = require('express-validator');

// @route       GET api/profile/me
// @desc        Get Loged In User
// @access      Private
router.get('/me', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatr']);

    // Check Profile Is Not Exists
    if (!profile) {
      return res.status(400).json({
        errors: [{
          msg: 'There are no Profile for this user '
        }]
      });
    }


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error")
  }
});


// @route       GET api/profile/me
// @desc        Get Loged In User 
// @access      Private
router.post('/', [auth, [
  check('status', 'Status is Required').not().isEmpty(),
  check('skills', 'Skills are Required').not().isEmpty()
]], async (req, res) => {

  try {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {

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
    if (company) profileFileds.company = company;
    if (location) profileFileds.location = location;
    if (website) profileFileds.website = website;
    if (status) profileFileds.status = status;
    if (bio) profileFileds.bio = bio;
    if (githubusername) profileFileds.githubusername = githubusername;
    if (skills) {
      profileFileds.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build Social Object
    profileFileds.social = {};
    if (twitter) profileFileds.social.twitter = twitter;
    if (facebook) profileFileds.social.facebook = facebook;
    if (linkedin) profileFileds.social.linkedin = linkedin;
    if (instagram) profileFileds.social.instagram = instagram;
    if (youtube) profileFileds.social.youtube = youtube;

    try {

      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {

        // Update User Profile if Exists
        profile = await Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFileds
        }, {
          new: true
        })

        return res.json(profile);

      }


      // Create New One if new 
      profile = new Profile(profileFileds);

      await profile.save();

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



// @route       GET api/profile/
// @desc        Get All Profile
// @access      Public
router.get('/', async (req, res) => {
  try {

    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})

// @route       GET api/profile/user/user_id
// @desc        Get Profile by User ID
// @access      Public
router.get('/user/:user_id', async (req, res) => {
  try {

    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({
        msg: 'No Profile found'
      })
    }

    res.json(profile);

  } catch (error) {
    console.error(error.kind);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        msg: 'No Profile found'
      })
    }

    res.status(500).send("Server Error")
  }
})


// @route       DELETE api/profile/
// @desc        Delete Profile, User and Post
// @access      Private
router.delete('/', auth, async (req, res) => {
  try {

    // @todo Remove Users Posts

    // Remove Profile 
    await Profile.findOneAndRemove({
      user: req.user.id
    });

    // Remove User
    await User.findOneAndRemove({
      _id: req.user.id
    });

    res.json({
      msg: 'User deleted!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})



// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      Private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {

    const profile = await Profile.findOne({
      user: req.user.id
    });

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})

// @route       DELETE api/profile/experience
// @desc        Delete profile experience
// @access      Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({
      user: req.user.id
    });

    // Get Remove Index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);


  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})


// @route       PUT api/profile/education
// @desc        Add profile education
// @access      Private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    school,
    degree,
    fieldofstudy,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    location,
    from,
    to,
    current,
    description
  }

  try {

    const profile = await Profile.findOne({
      user: req.user.id
    });

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})



// @route       DELETE api/profile/education
// @desc        Delete profile education
// @access      Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {

    const profile = await Profile.findOne({
      user: req.user.id
    });

    // Get Remove Index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);


  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})

module.exports = router;