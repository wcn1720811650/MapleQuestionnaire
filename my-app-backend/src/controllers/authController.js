const passport = require('passport');
const jwt = require('jsonwebtoken'); 

function googleLogin(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

function googleCallback(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
}

function loginSuccess(req, res) {
  try {
    console.log('req.user:', req.user);
    if (!req.user) {
      throw new Error('User not found in request');
    }

    const token = jwt.sign({ userId: req.user.id.toString(),role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/login?token=${token}&userId=${req.user.id.toString()}`);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}

function getProfile(req, res) {
  if (!req.user) {
    return res.redirect('/auth/google');
  }
  res.json(req.user);
}

module.exports = {
  googleLogin,
  googleCallback,
  loginSuccess,
  getProfile,
};