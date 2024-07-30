import { getUserEmailHandler, loginHandler, registerHandler, verifyOtpHandler } from "../controllers/handlers.js";
import { email_validation, login_validation, otp_validation, signup_validation } from "../utils/validation.js";
import { Router } from "express";
// import {check, validationResult} from 'express-validator'

const router = Router()

router.post('/login', login_validation, loginHandler)

router.post('/register', signup_validation, registerHandler)

router.post('/get-user-email', email_validation, getUserEmailHandler)

router.post('/verify-otp', otp_validation, verifyOtpHandler)

export default router