import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../../config/serverConfig";
import { ResponseBase, ResponseStatus } from "../payload/response.payload";

export const appClientAuthFillter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Request throught fillter!!!');
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            jwt.verify(token, serverConfig.jwt.accesskey, (err, user) => {
                console.log(user)
                // Check user inDB;
                if (err) {
                    const _response = ResponseBase(
                        ResponseStatus.FOBIDDENT,
                        err.message,
                        undefined);
                    res.status(403).json({ _response });
                }
                next();
            })
        } else {
            const _response = ResponseBase(
                ResponseStatus.WRONG_FORMAT,
                'Request_require_header_Authorization_but_you_missing',
                undefined);
            res.status(400).json({ _response });
        }

    } catch (err) {
        if (err) {
            const _response = ResponseBase(
                ResponseStatus.UNAUTHORIZE,
                'Request_require_header_Authorization_but_you_missing',
                undefined);
            res.status(401).json(_response);
        }
    }
};