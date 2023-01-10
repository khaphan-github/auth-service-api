import { serverConfig } from "../../../config/server.config";

import nodemailer from "nodemailer";
import { VerifyOTPReq } from "../payload/request/verifyotp.req";
import { NextFunction, Response } from "express";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: serverConfig.mailServer.username, // generated ethereal user
        pass: serverConfig.mailServer.password, // generated ethereal password
    },
});

export const sendOTPVerifyEmail = async (sendTo: string, otp: string) => {
    const info = await transporter.sendMail({
        from: '"MEETING HAPPY WEB" <foo@example.com>',
        to: sendTo,
        subject: "METTING WEB VERIFY OTP",
        html: HtmlOTPMessage(otp),
    });

    console.log("Message sent: %s", info.messageId);
}

const HtmlOTPMessage = (otp: string): string => {
    return `YOUR OTP: ${otp}`;
}
