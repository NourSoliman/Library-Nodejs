module.exports = {
    isAuth : (req , res , next) => {
        if ( req.isAuthenticated()) {
            return next()
        }
        res.render(`Sign/login` , {error : `Please login first`})
    }
}