import { NextFunction, Request, Response } from "express";
import { UserReq } from "../payload/request/user.req";
import { handleUserRegister } from "../services/user.service";

export const saveUser = (req: Request, res: Response, next: NextFunction) => {
    const userReq: UserReq = {
        fullname: req.body.fullname,
        email: req.body.email,
        credential: req.body.credential,
        publicKey: req.body.publicKey
    };
  
    handleUserRegister(userReq, res);
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