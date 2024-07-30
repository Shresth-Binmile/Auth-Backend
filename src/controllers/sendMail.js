import { main } from "../utils/mailer.js"

export async function sendMail (email){
    const otp = Math.floor(Math.random() * 899999 - 1) + 100000
    const msgID = await main(email, otp)
    console.log(msgID)
    console.log(otp);
    return otp
}