const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    accountId: {
        type:String,
        unique:true},
    tokenKey: String,
    tokenSecret:String,
    consumerKey: String,
    consumerSecret: String,
    url: String,
})



module.exports = mongoose.model('User', userSchema)