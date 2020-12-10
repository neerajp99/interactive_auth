const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true 
    },
    password: {
        v: {
            type: String,
            required: true
        },
        n: {
            type: Number,
            required: true
        }
    }
})

module.exports  = User = mongoose.model('users', UserSchema)