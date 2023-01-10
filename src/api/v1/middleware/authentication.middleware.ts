import console from "console";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../../config/server.config";
import { JWTModel } from "../model/jwt.model";
import { ResponseBase, ResponseStatus } from "../payload/Res/response.payload";
import { handleUserLogout } from "../services/jwt.service";

export const appClientAuthFillter = async (req: Request, res: Response, NextFunction: NextFunction) => {
    console.log('Request throught fillter!!!');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const logoutURL = '/user/oauth/logout';
    try {
        if (token) {
            jwt.verify(token, serverConfig.jwt.accesskey, (err, user) => {
                if (req.url == logoutURL) {
                    const userData = user as JWTModel;
                    if (userData.userID) { return handleUserLogout(userData.userID, res); }
                }
                if (err) {
                    const _response = ResponseBase(ResponseStatus.FORBIDDENT, err.message, undefined);
                    return res.status(403).json({ _response });
                }
                NextFunction();
            })
        } else {
            const _response = ResponseBase(ResponseStatus.WRONG_FORMAT,
                'Request require header Authorization but you missing', undefined);
            return res.status(400).json({ _response });
        }
    } catch (error) {
        const _response = ResponseBase(ResponseStatus.FORBIDDENT, 'Token invalid', undefined);
        return res.status(403).json({ _response });
    }
}