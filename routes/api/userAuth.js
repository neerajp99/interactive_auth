const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bigInt = require("big-integer")
const fs = require('fs')
 
/* Check for primes using Miller-Rabin Probabilistic test.
 * Checks for nontrivial square roots of 1 modulo n
*/

function miller_rabin_check_prime(val, test_no = 128){
    console.log(val)
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
    console.log(val, "\n\n")
    return val 
}

// Generate 50 bit prime numbers
function generate_prime_number(p){
    while (miller_rabin_check_prime(p) === false){
        p = generate_prime_bits(30)
    }
    return p
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
            const newUser = new User({
                email: req.body.email,
                password: req.body.password 
            })

            // Encrypting the password 
            const min_value = 1
            const max_value = Math.pow(2, 50) - 1
            // Generate the value for p, q
            const p = parseInt(Math.random() * (max_value - min_value + 1) + min_value);
            p = generate_prime_number(p)
            const q = parseInt(Math.random() * (max_value - min_value + 1) + min_value);
            q = generate_prime_number(q)
            while(p === q){
                q = generate_prime_number(q)
            }
            // Compute N = p * q 
            const N = p * q
            // Pick a random number w = {1, 2, ....., N-1} uniformly at random 
            const w = bigInt(Math.random() * (N-1) + 1)

            // Compute v 
            const v = bigInt(w.square() % N)

            console.log(v)
        }
    })
})


module.exports = router


