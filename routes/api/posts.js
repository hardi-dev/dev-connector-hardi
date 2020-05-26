const express = require('express');
const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route       POST api/post
// @desc        Create Post
// @access      private
router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

  const errors = validationResult(req);

  if( !errors.isEmpty() ) {
    return res.status(500).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })

    const posts = await newPost.save();

    res.send(posts);

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }



});

module.exports = router;