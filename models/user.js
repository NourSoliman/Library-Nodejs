const mongoose = require(`mongoose`)
const loginSchema = new mongoose.Schema({
    email:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required:true
    },
      role: {
        type: String,
        roles: ['user', 'admin' , `owner`],
        default: 'user'
      },
      blocked: {
        type: Boolean,
        default:false
      }
})
module.exports = new mongoose.model(`user` ,loginSchema )