import nodemailer from "nodemailer";
import { 
    BASE_URL,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD
} from '../config.js';


const transporter = nodemailer.createTransport({
    host:EMAIL_HOST,
    port:EMAIL_PORT,
    secure:true,
    auth:{
        user:EMAIL_USER,
        pass:EMAIL_PASSWORD
    }
});

export async function sendVerificationMail(address, token) {
    return await transporter.sendMail({
        from:"",
        to:address,
        subject:"new account verification",
        html: createVerificationMail(token)
    });
}

function createVerificationMail(token) {
    return `
    <!DOCTYPE html>
    <html lang="en">
        <style>
            html{
                background-color: white;
            }
            body{
                max-width: 600px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: auto;
                background-color: rgb(229, 255, 246);
                padding: 40px;
                border-radius: 4px;
                margin-top: 10px;
            }
        </style>
    <body>
        <h1>Email Verification - To-do List</h1>
        <p>An account has been created on To-do List using this email address.</p>
        <p>If you did not create this account, please disregard this email.</p>
        <p>If you did create the account, please verify it by clicking <a href="${BASE_URL}/verification/${token}">here</a>.</p>    
    </body>
    </html>
    `
}