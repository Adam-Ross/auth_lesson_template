const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/authorization')

router.get('/', authorization, async(req, res) => {
    try {
        // We are getting user id right here...
        // res.json(req.user)

        const user = await pool.query('SELECT user_name FROM users WHERE user_id = $1', [
            req.user
        ])

        res.json(user.rows[0])
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error from admin get route')
    }
})

router.get('/test', async (req, res) => {
    try {
        res.json({message: 'Test route working'})
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router;
