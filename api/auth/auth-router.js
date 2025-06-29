const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()
const User = require('../users/users-model')

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 8)
        const newUser = { username, password: hash }
        const result = await User.add(newUser)
        res.status(201).json({
            message: `nice to have you, ${result.username}`,
        })
    } catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const [user] = await User.findBy({ username })
        if (user && bcryptjs.compareSync(password, user.password)) {
            req.session.user = user
            res.json({ message: `welcome back, ${user.username}` })
        } else {
            next({ status: 401, message: 'bad credentials' })
        }
    } catch (err) {
        next(err)
    }
})

router.get('/logout', async (req, res, next) => {
    res.json({ message: 'logout working' })
})

module.exports = router 
