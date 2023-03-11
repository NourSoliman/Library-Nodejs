const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
passport.serializeUser((user, done) =>{
    console.log('serializeUser() called with user:', user);
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser() called with id:', id);
    try {
        const user = await User.findById(id);
        console.log("deserializeUser found user:", user);
        done(null, user);
    } catch (err) {
            console.error("deserializeUser error:", err);

        done(err);
    }
});