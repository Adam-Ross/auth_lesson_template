// before we hit our private routes, we are going to have access to rec, res, and NEXT - next is used to forward the req, res to the next function - hince the name, middleware

const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async(req, res, next) => {
    try {
        // destructure the token
        const jwtToken = req.header("token")

        if(!jwtToken) {
            return res.status(403).send('not authorized')
        }

        // This verify method on the jwt module tells us weather the jwt is valid. Takes two args. First is the jwt given to us in the req.header, the second is our secret.

        // calling this payload because if it is verified it returns a payload we can use in our routes
        const payload = jwt.verify(jwtToken, process.env.jwtSecret)

        // remember, in our jwtGenerator, we set a value of 'user' = to the value of our user_id. So really this is just giving us back the correct, now authorized user_id, and we can use that in our routes. 
        req.user = payload.user
        next()
    } catch (error) {
        console.error(error.message)
        return res.status(403).send('not authorized')
    }
}