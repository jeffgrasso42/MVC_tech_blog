const router = require('express').Router();
const { User, Comment, Post } = require('../models/');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [User, Comment],
    });
    // res.json(postData);
    const posts = postData.map(post => post.get({ plain: true }));
    res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.json(err);
  }
});

router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: { id: req.params.id },
      include: [User, Comment],
    });
    // res.json(postData);
    const post = postData.get({ plain: true });
    res.render('post', { post, logged_in: req.session.logged_in });
  } catch (err) {
    res.json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  // Otherwise, render the 'login' template
  res.render('login');
});

module.exports = router;
