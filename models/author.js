const mongoose = require(`mongoose`)
const Books  = require(`./books`)
const authorSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
}
})
authorSchema.pre(`remove` , function(next){
    Books.find({author: this.id}, (err , books) => {
        if(err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error(`this author has books still`))
        } else {
            next()
        }
    })
})
module.exports = mongoose.model(`Author` , authorSchema)