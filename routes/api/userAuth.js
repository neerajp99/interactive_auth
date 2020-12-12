const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bigInt = require("big-integer")
const fs = require('fs')
const randy = require('randy')
const path = require('path')
const { authorize } = require('passport')
const jwt = require("jsonwebtoken")
const keys = require('../../config/keys')
 
/* Check for primes using Miller-Rabin Probabilistic test.
 * Checks for nontrivial square roots of 1 modulo n
*/
function miller_rabin_check_prime(val, test_no = 128){
    // Handling the edge cases where the value is not even
    if(val.equals(2) || val.equals(3)){
        return true;
    }
    if(val.lesserOrEquals(1) || val.mod(2).equals(0)){
        return false;
    }
    // For Fermat's Little theorem: : a^(n-1) ≅ 1 (mod n).
    // For Miller Rabin, (n-1) = r * (2^s), with r odd.
    let s = bigInt(0) 
    let r = bigInt(bigInt(val)['value'] - 1n)
    let check = true
    while(r.and(1).equals(0)) {
        s.plus(1)
        r = bigInt(Math.floor(r.divide(2)))
    }

    // Run the tests for 128 times 
    for(let i = 0; i < test_no; i++){
        let a = bigInt.randBetween(2, bigInt(val)['value'] - 1n)
        let x = a.modPow(bigInt(r)['value'], bigInt(val)['value'])
        if(x.notEquals(1) && x.notEquals(bigInt(val)['value'] - 1n)) {
            let j = 1
            while (j < bigInt(s)['value'] && x.notEquals(bigInt(val['value'] - 1n))) {
                x = x.modPow(2, bigInt(val)['value'])
                if (x.equals(1)) {
                    return false
                }
                j += 1 
            }
        if(x.notEquals(bigInt(val)['value'] - 1n)) {
            return false
        }
        }
    }
    console.log('MUBARAKHO')
    return true
}

// Helper method for generate_prime_numbers
function generate_prime_bits(length) {
    /* 
     * Set the MSB to 1, to make sure that the number hold on "length" bits
     * Set the LSB to 1 to make be sure that it’s an odd number.
    */
    val = bigInt(randy.getRandBits(length))
    // Set the most significant and least significant bits of val to 1 and return
    length_shift = bigInt(1).shiftLeft(length - 1)
    val = val.or(length_shift)
    val = val.or(1)
    // val |= (1 << length - 1) | 1
    return val 
}

// Generate 50 bit prime numbers
function generate_prime_number(prime){
    while (miller_rabin_check_prime(prime) === false){
        prime = generate_prime_bits(50)
    }
    return prime
}

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
            // Encrypting the password 
            const min_value = 1
            const max_value = Math.pow(2, 50) - 1
            // Generate the value for p, q
            let p = bigInt(parseInt(Math.random() * (max_value - min_value + 1) + min_value));
            // Get a prime number closest to the random number generated for p
            p = generate_prime_number(p)
            let q = bigInt(parseInt(Math.random() * (max_value - min_value + 1) + min_value));
            // Get a prime number closest to the random number generated for q
            q = generate_prime_number(q)
            while(p === q){
                q = generate_prime_number(q)
            }
            // Compute N = p * q 
            const N = bigInt(p * q)
            let n_transform = bigInt(N)['value']

            // Pick a random number w = {1, 2, ....., N-1} uniformly at random 
            const w = bigInt(Math.random() * (N-1) + 1)

            // Compute v 
            const v = bigInt(w.square().mod(N))
            let v_transform = bigInt(v)['value']

            // Create a new mongoose model schema
            const newUser = new User({
                email: req.body.email,
                password: {
                    v: v_transform,
                    n: N
                }
            })
            // Save the model 
            newUser.save()
            .then(user => {
                console.log('User saved successfully!')
                // Create a local file and save to it 
                let content = "hello world!"
                current = process.cwd()
                let createStream = fs.createWriteStream(`${current}/${newUser.email}.txt`);
                createStream.end();
                let writeStream = fs.createWriteStream(`${current}/${newUser.email}.txt`);
                writeStream.write(`${w}\n`);
                writeStream.write(`${N}\n`);
                writeStream.write(`${req.body.password}`)
                writeStream.end();
                res.json(user)
            })
            .catch(err => {
                console.log(err)
            })
        }
    })
    .catch(error => {
        console.log(error)
    })
})

// @route POST /api/userAuth/login
// @description Login User 
// @access Public 
router.post("/login", (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(data => {
        if (!data) {
            console.log('No user with this email address')
            const error = "No user with this email address exists!"
            return res.status(404).json(error)
        }
        
        let password = data.password 
        let v = password.v 
        v = bigInt(v)
        let n = password.n 
        console.log('N', n)

        // Open the local file with the value of w and n 
        current_file = ""
        let info = data
        try {
            const datas = fs.readFileSync(`${info.email}.txt`, 'utf8')
            current_file += datas
        } catch (err) {
            console.error("File Error: ", err)
        }
        file_data = current_file.split("\n")
        let w = bigInt(file_data[0])

        let passwords = file_data[2]

        if(passwords !== req.body.password){
            console.log('Incorrect password')
            return res.status(400).json('Incorrect password!')
        }

        // Pick a random value of x from the range 1 to N-1 
        let x = bigInt(Math.random() * (n-1) + 1)
        // Generate the value of x 
        x = generate_prime_number(x)
        let gcd = bigInt.gcd(x, n)
        // Fetch the value of x unless its smaller than N and the gcs (x, N) = 1
        while (x.greater(n) && gcd.notEquals(1)) {
            x = generate_prime_number(x)
            gcd = bigInt.gcd(x, n)
        }

        // Calculate the value of y 
        let y = bigInt(x.square().mod(n))

        // Generate a random value between 0 and 1 
        let b = Math.round(Math.random())
        // Calculate the value of z 
        let z = 0
        
        // Conditions for getting the value of z 
        if(b === 0) {
            z = x 
        } else {
            z = x.multiply(w)
        }
        
        // Check for authorization 
        let authorize = false 
        let sq_z = bigInt(z.square())
        let vy = y.multiply(v)

        if (b === 0) {
            if (sq_z.mod(n).equals(y)){
                authorize = true 
            }    
        }
        else if (b === 1) {
            let difference = sq_z.subtract(vy)
            if (difference.mod(n).equals(0)) {
                authorize = true
            }
        }
        else {
            authorize = True 
        }

        console.log('x', x)
        console.log('y', y)
        console.log('z', z)
        console.log('n', n)
        console.log('v', v)
        console.log('b', b)
        console.log('AUTHORIZE', authorize)

        // Create a bearer token for user authentication if the user
        if (authorize) {
            // Create payload 
            const payload = {
                id: data.id,
                email: data.email,
            }

            // Sign jwt token 
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 10000
                },
                (error, token) => {
                    return res.json({
                        success: true,
                        token: "Bearer " + token
                    })
                }
            )
        } else {
            return res.status(401).json("Incorrect password!")
        }
        
    })
})

module.exports = router