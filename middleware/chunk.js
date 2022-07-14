// before we hit our private routes, we are going to have access to rec, res, and NEXT - next is used to forward the req, res to the next function - hince the name, middleware

const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async(req, res, next) => {
    try {
        
        const chunk = req.header("chunk")

        if(!chunk) {
            return res.status(401).json('Chunk missing')
        }


        if(chunk < process.env.chunk) {
            return res.status(401).json('Chunk too small, maybe try and make it bigger')
        }
        next()
    } catch (error) {
        console.error(error.message)
        return res.status(403).send('not authorized')
    }
}