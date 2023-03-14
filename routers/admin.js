const express = require(`express`)
const router = express.Router()
const user = require(`../models/user`)
const flash = require('express-flash');

//Middleware function to check if User is admin or not
const checkAdmin = (req  , res , next) => {
    if(req.isAuthenticated() && req.user.role === `admin`) {
        return next()
    } else if(req.isAuthenticated()) {
        res.send(`Unauthorized`)
    }
     else {
        res.redirect(`/Sign/login`)
    }
}
router.get('/promote', checkAdmin, (req, res) => {
    res.render('admin/promote');
  })
//find the user that i wanna promote to admin
router.post(`/promote` , checkAdmin , async (req , res) => {
    const email = req.body.email;

    //find user by Email
    const User = await user.findOne({email})

    if(!User) {
        req.flash(`error` , `user not found`);
        return res.redirect(`/admin/promote`)
        
    }

    // promote user to admin 
    User.role = `admin`
    await User.save()
    req.flash('success', 'User promoted to admin');
    return res.redirect('/admin/promote');
})
module.exports = router