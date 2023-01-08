import { NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/clientkey.req";
import { handleAppClientAuthenticate, hanldeUserAuthenticate } from '../services/rsa.service';
import { ClientAccount } from '../payload/request/clientaccount.req';


export class SecurityController {
    static appClientAuthenticate = (req: Request, res: Response, next: NextFunction) => {
        const _client: ClientKey = {
            clientId: req.body.clientId,
            clientSecret: req.body.clientSecret,
        };
        handleAppClientAuthenticate(_client, res);
    };
    static userAuthenticate = (req: Request, res: Response, next: NextFunction) => {
        const account: ClientAccount = {
            credential: req.body.credential,
            publicKey: req.body.publicKey
        };
        hanldeUserAuthenticate(account, res);    
    }
}