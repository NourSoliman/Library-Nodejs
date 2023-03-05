const express = require(`express`)
const app = express();
const expressLayouts = require(`express-ejs-layouts`)
const path = require("path");
const methodOverride = require('method-override')

//routers 
const indexRouter = require(`./routers/index`)
const authorRouter = require(`./routers/authors`)
const bookRouter = require(`./routers/books`)


//mongoose
const mongoose = require(`mongoose`)
mongoose.set('strictQuery', true)
const dbURL = "mongodb+srv://nour1:tiamoodio1@cluster0.uahdnld.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURL)
const db = mongoose.connection
db.on(`error` , error => console.log(error))
db.once(`open` , ()=> console.log(`connected`))



// app set
app.use(methodOverride('_method'))
app.use(express.urlencoded( {extended:false} ))
app.set(`views` , path.join(__dirname,`views`))
app.set('view engine','ejs')
app.set(`layout` , `layouts/layout`)
app.use(expressLayouts)
app.use(express.static(`public`))
app.use(`/` , indexRouter)
app.use(`/authors` , authorRouter)
app.use(`/books` , bookRouter)
app.listen(8080)




