const express = require(`express`)
const router = express.Router()
router.get('/logout', (req, res) => {
  const currentUser = req.user;
    req.user = null;
    req.session.destroy(); // Destroy the session to log out the user
    console.log(`${currentUser} logged out`);
    res.redirect('Sign/login');
  });
  module.exports = router;