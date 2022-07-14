const router = require('express').Router()
const pool = require('../db')
const chunk = require('../middleware/chunk')

router.get('/chunk', chunk, async(req, res) => {
   try {
       const newChunk = Math.floor(Math.random() * 100)
        res.status(200).json(newChunk)
   } catch (error) {
       console.error(error.message)
   }
})



module.exports = router;
