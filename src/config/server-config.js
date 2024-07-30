import dotenv from 'dotenv';

dotenv.config()

export default {
    PORT:process.env.PORT,
    SENDER_EMAIL:process.env.SENDER_EMAIL,
    SENDER_PASS:process.env.SENDER_PASS,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    DB_USER:process.env.DB_USER,
    DB_PASS:process.env.DB_PASS
}