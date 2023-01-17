import { NextFunction, Request, Response } from "express";
import { UserReq } from "../payload/request/user.req";
import { VerifyOTPReq } from "../payload/request/verifyotp.req";
import { handleVerifyOTPByEmail } from "../services/otp.service";
import { handleUserRegister } from "../services/user.service";

export const saveUser = (req: Request, res: Response, next: NextFunction) => {
    const userReq: UserReq = {
        fullname: req.body.fullname,
        email: req.body.email,
        credential: req.body.credential,
    };
    handleUserRegister(userReq, res, next);
}
export const getUserBy = (req: Request, res: Response, next: NextFunction) => {
    res.json({ "message": "OKe" });
}
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    res.json({ "message": "OKe" });
}
export const deleteUserBy = (req: Request, res: Response, next: NextFunction) => {
    res.json({ "message": "OKe" });
}
export const verifyOTP = (req: Request, res: Response, next: NextFunction) => {
    const verifOTPReq: VerifyOTPReq = {
        id: req.body.id,
        otp: req.body.otp
    };
    handleVerifyOTPByEmail(verifOTPReq, res, next);
}