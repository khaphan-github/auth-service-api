import { NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/clientkey.req";
import { handleAppClientAuthenticate, hanldeUserAuthenticate } from '../services/rsa.service';
import { ClientAccount } from '../payload/request/clientaccount.req';
import { RefreshTokenReq } from '../payload/request/refreshToken.req';
import { JWT } from '../services/jwt/jwt.service';

export class SecurityController {
    static appClientAuthenticate = (
        req: Request,
        res: Response,
        next: NextFunction) => {

        const _client: ClientKey = {
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret,
        };

        handleAppClientAuthenticate(_client, res);
    };

    static userRefreshToken = (
        req: Request,
        res: Response,
        next: NextFunction) => {

        const refreshTokenReq: RefreshTokenReq = {
            accessToken: req.body.accessToken,
            refreshToken: req.body.refreshToken,
        };
        JWT.HandleUserRefreshToken(refreshTokenReq, res, next);
    };

    static userAuthenticate = (
        req: Request,
        res: Response,
        next: NextFunction) => {


        const account: ClientAccount = {
            credential: req.body.credential,
        };
        hanldeUserAuthenticate(account, res);
    };

    static userSignOut = (
        req: Request,
        res: Response,
        next: NextFunction) => {

        const refreshTokenReq: RefreshTokenReq = {
            accessToken: req.body.accessToken,
            refreshToken: req.body.refreshToken,
        }
        JWT.handleUserSignOut(refreshTokenReq, res, next);
    }
}