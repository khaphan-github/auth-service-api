import { NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/clientkey.req";
import { handleAppClientAuthenticate, hanldeUserAuthenticate } from '../services/rsa.service';
import { ClientAccount } from '../payload/request/clientaccount.req';
import { handleUserRefreshToken } from '../services/jwt.service';
import { RefreshTokenReq } from '../payload/request/refreshToken.req';


export class SecurityController {
    static appClientAuthenticate = (req: Request, res: Response, next: NextFunction) => {
        const _client: ClientKey = {
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret,
        };
        handleAppClientAuthenticate(_client, res);
    };

    static userRefreshToken = (req: Request, res: Response, next: NextFunction) => {
        const refreshTokenReq: RefreshTokenReq = {
            userID: req.body.userID,
            refreshToken: req.body.refreshToken,
        }
        handleUserRefreshToken(refreshTokenReq, res);
    };

    static userAuthenticate = (req: Request, res: Response, next: NextFunction) => {
        const account: ClientAccount = {
            credential: req.body.credential,
            publicKey: req.body.publicKey
        };
        hanldeUserAuthenticate(account, res);
    };
}