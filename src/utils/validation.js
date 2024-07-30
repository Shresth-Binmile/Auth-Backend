import {check} from 'express-validator'

export const login_validation = [
    check('email', 'Email length should be 10 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('password', 'Password length should be 8 to 10 characters')
                    .isLength({ min: 8, max: 10 })
]

export const signup_validation = [
    check('email', 'Email length should be 10 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('username', 'Username length should be 10 to 20 characters')
                    .isLength({ min: 10, max: 20 }),
    check('password', 'Password length should be 8 to 10 characters')
                    .isLength({ min: 8, max: 10 })
]

export const email_validation = [
    check('email', 'Email length should be 10 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 })
]

export const otp_validation = [
    check('otp', 'Otp should contains 6 digits')
                    .isLength({ min: 6, max: 6 })
]