const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('../db')
const router = express.Router()
const jwtGenerator = require('../utils/jwtGenerator')
const validInfo = require('../middleware/validInfo')
const authorization = require('../middleware/authorization')
// express-validator

router.post('/register', validInfo, async (req, res) => {
    try {
        // 1. Destructure body data
        const {name, email, password} = req.body
        // 2. Check to see if the user exists already
        
        const user = await pool.query('SElECT * FROM users WHERE user_email = $1;', [
            email
        ])

        if(user.rows.length !== 0) {
            return res.status(401).send('user alredy exists')
        }

        // 3. bcrypt the password
        const saltRounds = 10
        const salt =  await bcrypt.genSalt(saltRounds)
        const bcryptPassWord = await bcrypt.hash(password, salt)

        const newUser = await pool.query("INSERT INTO users(user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *", [
            // remember to pass in the bcryptPassWord and not the req.password
            name, email, bcryptPassWord
        ])
        
        // 4. Create a token
        const token = jwtGenerator(newUser.rows[0].user_id)

        res.json({token})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error...')
    }
})

// login
router.post('/login', validInfo, async(req, res) => {
    try {
        // destructure
        const { email, password} = req.body

        // see if user exists
        const user = await pool.query("SELECT * FROM users WHERE user_email  = $1", [
            email
        ])

        if(user.rows.length < 1) {
            return res.status(404).send('User not found...')
        }
        // check if incoming password is the same as DB password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password)
        
        if(!validPassword) {
            return res.status(401).send('Name or email is wrong...')
        }
        // give them the JWT token
        const token = jwtGenerator(user.rows[0].user_id)

        res.json({token})

    } catch (error) {
        console.error(error.message)        
        res.status(500).send('Server error')
    }
})

// react re-renders, so we need a route to check to see if user if verified when after re-render. This will make more sense when we build front end. Note, our middlware is doing most of the work here.
router.get('/verify', authorization, async(req, res) => {
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message)        
        res.status(500).send('Server error')
    }
})

// test route by creating a new user, grab the token, then run a get on this route. Header, key of token. 





module.exports = router

