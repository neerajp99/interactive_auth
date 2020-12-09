const express = require('express')
const router = express.Router()
const User = require('../../models/User')

// @route POST /api/userAuth/register 
// @description Register User 
// @access Public 
router.post("/register", (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(data => {
        if(data){
            return res.status(400).json("Email address already exists")
        } else{
            const newUser = new User({
                email: req.body.email,
                password: req.body.password 
            })

            // Encrypting the password 

        }
    })
})


module.exports = router