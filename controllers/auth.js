const bcrypt = require('bcrypt')

const User = require('../models/user')

const signUp = (req, res) => {
    res.render('auth/signup.ejs', {title: 'Sign up', msg: ''})
}

const addUser = async (req, res) => {
    console.log('request body: ', req.body)
    const userInDatabase = await User.findOne({ username: req.body.username})
    if (userInDatabase) {
        return res.render('auth/signup.ejs', {
            title: 'Sign up',
            msg: 'Username already taken.'
        })
    }
    
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('auth/signup.ejs', {
            title: 'Sign up',
            msg: 'Confirm password must match.'
        })
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

    const user = await User.create(req.body)
    console.log('New user: ', user)
}

const signInForm = (req, res) => {
    res.render('auth/signin.ejs', {
        title: 'Sign in',
        msg: ''
    })
}

const signIn = async (req, res) => {
    console.log('req.body: ', req.body)
    const userInDatabase = await User.findOne({ username: req.body.username})
    if (!userInDatabase) {
        return res.render('auth/signin.ejs', {
            title: 'Sign in',
            msg: 'Invalid credentials, please try again.'
        })
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    )
}

module.exports = {
    signUp,
    addUser,
    signInForm,
    signIn
}