const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    number:{
        type:Number,
    },
    gender:{
        type:String,
    },
    refreshToken:{
        type:String,
    }

})

const UserSchema = mongoose.model('UserSchema', userSchema);

module.exports = UserSchema;