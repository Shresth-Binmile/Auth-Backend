import bcryptjs from "bcryptjs"
import Users from "../models/user.js"
import verification_tables from "../models/verification_table.js"
import jwt from 'jsonwebtoken'
import { sendMail } from "./sendMail.js"
import { sequelize } from "../utils/connectDB.js"
import { codes } from "../utils/codes.js"
import { messages } from "../utils/messages.js"
import { validationResult } from 'express-validator'
import ENV from '../config/server-config.js'

export const loginHandler = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(codes.conflict).json(errors)
        }

        const token = req.headers['signin-token']
        if(token){
            return res.status(codes.OK).json({
                message: messages.login_success
            })
        }

        const { email, password } = req.body

        const user = await Users.findOne({ where: { email } })

        if (!user) {
            return res.status(codes.not_found).json({
                message: messages.user_not_exist
            })
        }

        const isMatch = await bcryptjs.compare(password, user.dataValues.password)
        if (!isMatch) {
            return res.status(codes.unauthorized).json({
                message: messages.incorrect_credentials
            })
        }

        if (user.dataValues.verified == 0) {
            return res.status(codes.unauthorized).json({
                messages: `${messages.redirect_msg}verification page...`
            })
        }

        const signin_token = jwt.sign({id: user.dataValues.id}, ENV.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })
        
        return res.setHeader('signin-token', signin_token).status(codes.OK).json({
            messages: `${messages.login_success} ${messages.redirect_msg}home page...`
        })

    } catch (error) {
        return res.status(codes.bad_request).json({
            message: `${messages.signIn_err}${error}`
        })
    }
}

export const registerHandler = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(codes.conflict).json(errors)
        }

        const { username, email, password } = req.body
        const token = req.headers['signup-token']

        const user = await Users.findOne({ where: { email } })

        if (user) {
            return res.status(codes.conflict).json({
                message: messages.already_registered
            })
        }
        console.log(token)
        if(!token){
            return res.status(400).json({
                message: messages.token_expired
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = await Users.create({
            username,
            password: hashPassword,
            email,
            verified: true
        })

        return res.status(codes.OK).json({
            messages: `${messages.redirect_msg}login page...`
        })
    } catch (error) {
        return res.status(codes.bad_request).json({
            message: `${messages.signup_err}${error}`
        })
    }
}

export const getUserEmailHandler = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(codes.conflict).json(errors)
        }

        // get email from user & store it in verification table
        // generate otp & store it in verification table, then
        // send mail to the input email for otp verification
        const { email } = req.body
        const otp = await sendMail(email)
        const isExist = await verification_tables.findOne({ where: { email } })

        if(isExist){
            await verification_tables.update({vCode: otp}, {where: {email}})
        }
        else{
            const vt = await verification_tables.create({
                email,
                vCode: otp
            })
        }
        return res.status(codes.OK).json({
            message: messages.ok
        })
    } catch (error) {
        return res.status(codes.bad_request).json({
            message: error.message
        })
    }
}

export const verifyOtpHandler = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(codes.conflict).json(errors)
        }

        // get user-email & user-otp from query & body respectively
        // compare USER OTP  with the otp that is saved in the verification table
        // if match set veerification_table.verified = true
        // else respond with the error
        // create otp_token if you have time
        // redirect to register page
        const { email } = req.query
        const { otp } = req.body

        const user = await verification_tables.findOne({ where: { email } })

        const isMatch = user.dataValues.vCode === otp
        if (!isMatch) {
            return res.status(codes.otp_invalid).json({
                message: messages.incorrect_otp
            })
        }

        await verification_tables.update({ verified: true, vCode: null },
            {
                where: {
                    email: email
                }
            }
        )

        const otp_token = jwt.sign({
            id: user.dataValues.id,
            email: user.dataValues.email
        },
            ENV.JWT_SECRET_KEY,
            {
                expiresIn: '1h'
            }
        )

        console.log(otp_token)
        return res.setHeader('signup-token', otp_token).status(codes.otp_validation_successful).json({
            message: messages.verification_successful
        })
    } catch (error) {
        return res.status(codes.bad_request).json({
            message: `${messages.verify_err}${error}`
        })
    }
}