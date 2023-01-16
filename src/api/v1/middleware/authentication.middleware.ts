import { NextFunction, Request, Response } from "express";
import { ResponseBase, ResponseStatus } from "../payload/Res/response.payload";
import { JWT } from "../services/jwt/jwt.service";

export const appClientAuthFillter = async (req: Request, res: Response, NextFunction: NextFunction) => {
    const token = getHeaderAuth(req);
    // const logoutURL = '/user/oauth/logout';
    if (!token) {
        const _response = ResponseBase(ResponseStatus.WRONG_FORMAT,
            'Request require header Authorization but you missing');
        return res.status(400).json(_response);
    }
    // hanlde user signout
    JWT.verifyAccessToken(token, res, NextFunction);
}

export const getHeaderAuth = (req: Request) => {
    return req.header('Authorization')?.replace('Bearer ', '');
}