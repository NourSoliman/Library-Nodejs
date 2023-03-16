const express = require(`express`)
const router = express.Router()
const user = require(`../models/user`)
const flash = require('express-flash');

//Middleware function to check if User is admin or not
const checkAdmin = (req  , res , next) => {

    if(req.isAuthenticated() && req.user.role === `owner`) {
        return next()
    } else if(req.isAuthenticated()) {
        res.render(`admin/promote`)
    }
     else {
        res.redirect(`/Sign/login`)
    }
}
router.get('/promote', checkAdmin, (req, res) => {
    const {error , successMessage} = req.query;
    res.render('admin/promote' , {error , successMessage});
  })
//find the user that i wanna promote to admin
router.post(`/promote` , checkAdmin , async (req , res) => {
    const email = req.body.email;

    //find user by Email
    const User = await user.findOne({email})

    if(!User) {

        return res.redirect(`/admin/promote?error=User+Not+Found`)
        
    }

    // promote user to admin 
    User.role = `admin`
    await User.save()

    return res.redirect('/admin/promote?successMessage=User+promoted+to+admin');
})
module.exports = router