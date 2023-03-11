const express = require(`express`)
const userSchema = require(`../models/user`)
const router = express.Router()
const Joi = require(`joi`)
const bcrypt = require(`bcrypt`);
const saltRounds = 10;
const passport = require('passport');
const flash = require('express-flash');



/*Sign up Router*/


router.get("/signup", (req, res , next) => {
  if(req.user) {
    res.redirect("/")
  } else {
    res.render('Sign/signup')
  }
  next()
});
//Sign in router
router.get("/login",  (req, res , next) => {
  if(req.user) {
    res.redirect("/")
  } 
  else {
    res.render('Sign/login' , {error : req.flash(`error`)})
  }
  next()
});
//


//Sign up//
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
      const passwordSchema = Joi.string().min(8).required();

    try {
      await passwordSchema.validateAsync(password)
      const hashPassword = await bcrypt.hash(password , saltRounds);

      //check if email already exist in the database
      const user = await userSchema.findOne({email})
      if(user) {
        return res.render("Sign/signup" , {email , error : "Email Already Exist"})
      }

      //create a new user
        const newUser = await userSchema.create({
            email,
            password: hashPassword
        });
        console.log(`User ${newUser.email} created successfully.`);
        req.session.user = newUser
        res.render( `Sign/login`, {user : req.session.user})
        // res.redirect('/Sign/login');
        return;
    } catch (error) {
        console.error(error);
        const errorText = error.isJoi ? error.details[0].message.replace(`"value"` , `password`) : `error creating a user`
        if(error.isJoi) {
          res.render("Sign/signup" , {email , error:errorText})
        } 
    }
});





//Sign in //
router.post('/login', (req , res , next) =>{ 
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/Sign/login',
    failureFlash: true
})(req , res , next)
})
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const Schema = Joi.object({
//       email:Joi.string().email().required(),
//       password:Joi.string().required()
//     })
//     try {
//       await Schema.validateAsync(req.body);
//     }
//     catch(error) {
//       console.log(error);
//       return res.status(400).render("Sign/login" , {error : error.message})
//     }
//     // Find the user by email
//       const user = await userSchema.findOne({ email });

//       if (!user) {
//         return res.render("Sign/login" , {error : error.message});
//       }
//       //Compare the Hashed Password
//       const isPasswordValid = await bcrypt.compare(password , user.password);
//       if(!isPasswordValid) {
//         return res.render("Sign/login" , {error : "Invailed Email or Password"})
//       }
//       req.session.user = user; // Set the user variable in the session
//       console.log(`${user} opened successful`);
//       res.redirect('/'); // Redirect to home page

//     });


module.exports = router;
