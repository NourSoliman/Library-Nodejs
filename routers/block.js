const express = require(`express`)
const router = express.Router()
const user = require(`../models/user`)
const flash = require('express-flash');

router.get(`/block` , (req , res ) => {
    res.render(`admin/block`)
})
router.post(`/block` , async (req , res) => {
    try { 
        const {email} = req.body;
        const foundUser = await user.findOne({email})
        if(!foundUser) {
            req.flash(`error_msg` , `User Not Found`)
            return res.redirect(`admin/block`)
        }
        foundUser.blocked = true;
        const blockedUser = new user(foundUser)
        await blockedUser.save()
        res.redirect(`/`)
    } catch(error) {
        console.log(error);
        res.send(`error`)
    }
})
module.exports = router