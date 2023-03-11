

const express = require(`express`)
const app = express();
const expressLayouts = require(`express-ejs-layouts`)
const path = require("path");
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require(`connect-mongo`)
const User = require(`./models/user`)
const flash = require('connect-flash');
//session
app.use(flash())


app.use(session({
    // secret: process.env.SESSION_SECRET,
    secret:`secret`,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:"mongodb+srv://nour1:tiamoodio1@cluster0.uahdnld.mongodb.net/?retryWrites=true&w=majority"
    })
}));

//passport middleware 
require('./config/passport')
app.use(passport.initialize());
app.use(passport.session());

app.get(`*` , (req , res , next) => {
    res.locals.user = req.user || null
    next()
})

//routers 
const indexRouter = require(`./routers/index`)
const authorRouter = require(`./routers/authors`)
const bookRouter = require(`./routers/books`)
const SignRouter = require(`./routers/userSign`)
const LogoutRouter = require(`./routers/logout`)

//mongoose
const mongoose = require(`mongoose`)
mongoose.set('strictQuery', true)
const dbURL = "mongodb+srv://nour1:tiamoodio1@cluster0.uahdnld.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURL)
const db = mongoose.connection
db.on(`error` , error => console.log(error))
db.once(`open` , ()=> console.log(`connected`))





















app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded( {extended:false} ))
app.set(`views` , path.join(__dirname,`views`))
app.set('view engine','ejs')
app.set(`layout` , `layouts/layout`)
app.use(expressLayouts)
app.use(express.static(`public`))
app.set('passport', passport);
app.use(`/` , indexRouter)
app.use(`/authors` , authorRouter)
app.use(`/books` , bookRouter)
app.use(`/Sign` , SignRouter )
app.use(`/` , LogoutRouter)
app.listen(8080)




