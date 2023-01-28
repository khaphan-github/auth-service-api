import { Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions, VerifyErrors, VerifyOptions } from "jsonwebtoken";
import { JWTModel } from "../../model/jwt.model";
import { TokenKeypairModel } from "../../model/tokenkeypair.model";
import { RefreshTokenReq } from "../../payload/request/refreshToken.req";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import * as schedule from "node-schedule";
import child_process from 'child_process';
import { MemCache } from "../../../../lib/cache.lib";
import { ResponseBase, ResponseStatus } from "../../payload/Res/response.payload";
import { Token, TokenResponse } from "../../payload/Res/clientOauth.res";

const enum RefreshTokenSecret {
    PUBLICKEY = 'es512-public-refresh-token.pem',
    PRIVATEKEY = 'es512-private-refresh-token.pem'
}
const enum AccessTokenSecret {
    PUBLICKEY = 'es512-public-access-token.pem',
    PRIVATEKEY = 'es512-private-access-token.pem'
}
const enum TypeVerify {
    Access, Refresh, SignOut
}
/** JWT ROLE ♥
 * 1. Openssl to generate public key and private key both access token and refresh token ♪
 * 2. ES256 algorithms was used for best security ♪
 * 3. Every 10 minutes refresh key pairs be call to generate new key pair for more security ♪
 * 4. Access token exprise time in 5 minutes, refresh token is 10 minutes ♪
 * 5. Refresh token valid when access token invalid before 1 minutes ♪
 * 6. When refresh token call before valid time this token be push to blacklist
 * 7. When user sign out token key pairs be push to blacklist  
 * 8. When system init new secrect - emply blacklist;
 */

export class JWT {
    private static BlackListToken: Map<string, string> = new Map<string, string>();

    private static moveSecretKeytoCache = async () => {
        const expriseTime = 60 * 11;

        await MemCache.setItemFromCacheBy(RefreshTokenSecret.PUBLICKEY,
            JWT.getKeyFromFile(RefreshTokenSecret.PUBLICKEY), expriseTime);

        await MemCache.setItemFromCacheBy(RefreshTokenSecret.PRIVATEKEY,
            JWT.getKeyFromFile(RefreshTokenSecret.PRIVATEKEY), expriseTime);

        await MemCache.setItemFromCacheBy(AccessTokenSecret.PUBLICKEY,
            JWT.getKeyFromFile(AccessTokenSecret.PUBLICKEY), expriseTime);

        await MemCache.setItemFromCacheBy(AccessTokenSecret.PRIVATEKEY,
            JWT.getKeyFromFile(AccessTokenSecret.PRIVATEKEY), expriseTime);
    }

    private static prepareJWTSecret = () => {
        JWT.generateKeyByShellScript(AccessTokenSecret.PUBLICKEY, AccessTokenSecret.PRIVATEKEY);
        JWT.generateKeyByShellScript(RefreshTokenSecret.PUBLICKEY, RefreshTokenSecret.PRIVATEKEY);
    }

    /** Job call every 10 minutes to refresh */
    public static refreshSecretKeyJob() {
        const stateDate = new Date(Date.now());
        const ruleCorn = '*/10  * * * *';

        schedule.scheduleJob({ start: stateDate, rule: ruleCorn }, () => {
            console.log('⚡️ [server - job] Refresh JWT secret key at', Date.now());

            JWT.moveSecretKeytoCache();
            JWT.prepareJWTSecret();
            JWT.BlackListToken.clear();
        });
    }

    private static generateKeyByShellScript = (tokenPublic: string, tokenPrivate: string) => {
        const workPath = 'src/api/v1/services/jwt/key';
        const genPrivateKeyProcess = child_process.spawn('openssl',
            ['ecparam', '-genkey', '-name', 'secp521r1', '-noout', '-out', tokenPrivate],
            { cwd: workPath }
        );

        genPrivateKeyProcess.on('close', (code) => {
            if (code === 0) {
                child_process.spawn('openssl',
                    ['ec', '-in', tokenPrivate, '-pubout', '-out', tokenPublic],
                    { cwd: workPath }
                );
            };
        });
    }

    private static getKeyFromFile(filePath: string): string {
        const rootPath = './src/api/v1/services/jwt/key/';
        return fs.readFileSync(rootPath + filePath, { encoding: 'utf8', flag: 'r' });
    }

    private static generateAccessToken = (payload: JwtPayload) => {
        const accessTokenPrivateKey = JWT.getKeyFromFile(AccessTokenSecret.PRIVATEKEY);

        const option: SignOptions = {
            jwtid: uuidv4(),
            algorithm: 'ES512',
            expiresIn: 60 * 5, // 5 minutes
        }
        return jwt.sign(payload, accessTokenPrivateKey, option);
    }

    private static generateRefreshToken = (payload: JwtPayload) => {
        const refreshTokenPrivateKey = JWT.getKeyFromFile(RefreshTokenSecret.PRIVATEKEY);

        const option: SignOptions = {
            jwtid: uuidv4(),
            algorithm: 'ES512',
            expiresIn: 60 * 10, // 10 minutes
        }
        return jwt.sign(payload, refreshTokenPrivateKey, option);
    }

    public static initTokenKeypair = (userID: string, email: string, fullName: string): TokenKeypairModel => {
        const payload: JwtPayload = {
            sub: userID,
            scope: 'user',
            email: email,
            name: fullName,
        };
        const tokenKeypair: TokenKeypairModel = {
            accessToken: JWT.generateAccessToken(payload),
            refreshToken: JWT.generateRefreshToken(payload),
        };
        return tokenKeypair;
    }

    private static handleJWTBase = (token: string, err: VerifyErrors | null,
        decoded: string | jwt.JwtPayload | jwt.Jwt | undefined,
        res: Response, NextFunction: NextFunction, type: TypeVerify) => {

        const errResponse = ResponseBase(ResponseStatus.UNAUTHORIZE, 'Token invalid');

        if (err) {
            return res.status(401).json(errResponse)
        }

        if (decoded && JWT.BlackListToken.has((decoded as JWTModel).jti)) {
            return res.status(403).json(ResponseBase(ResponseStatus.FORBIDDENT, 'Token is blocked'));
        }

        if (type != TypeVerify.Access) {
            JWT.BlackListToken.set((decoded as JWTModel).jti, token);
        }

        switch (type) {
            case TypeVerify.Access:
                NextFunction();
                break;

            case TypeVerify.SignOut:
                console.log(token)
                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Sign out success'));

            case TypeVerify.Refresh:
                const payload = decoded as JWTModel;
                const notBefore: boolean = payload.exp - (Math.floor(Date.now() / 1000)) > 60 * 6; // 6 minutes

                if (notBefore) {
                    return res.status(403).json(ResponseBase(ResponseStatus.FORBIDDENT, 'Token not active'));
                }

                const tokens = JWT.initTokenKeypair(payload.sub, payload.email, payload.name);
                const tokenRes: Token = TokenResponse(tokens.accessToken, tokens.refreshToken);

                return res.status(200).json(ResponseBase(ResponseStatus.SUCCESS, 'Refresh token success', tokenRes));
        }
    }

    private static verifyToken = (token: string, key: string, res: Response, NextFunction: NextFunction, type: TypeVerify) => {
        const keyFromFile = JWT.getKeyFromFile(key);
        const option: VerifyOptions = { algorithms: ['ES512'] }

        jwt.verify(token, keyFromFile, option, async (err, decoded) => {
            if (err?.name === 'JsonWebTokenError') {
                const keyFromCache = await MemCache.getItemFromCacheBy(key);
                if (!keyFromCache) {
                    return res.status(403).json(ResponseBase(ResponseStatus.FORBIDDENT, 'Token invalid'));
                }
                jwt.verify(token, keyFromCache, option, (err, decoded) => {
                    return JWT.handleJWTBase(token, err, decoded, res, NextFunction, type);
                });
            }
            return JWT.handleJWTBase(token, err, decoded, res, NextFunction, type);
        });
    }

    public static verifyAccessToken = 
        (accessToken: string,
        res: Response,
        NextFunction: NextFunction) => {

        JWT.verifyToken(
            accessToken,
            AccessTokenSecret.PUBLICKEY,
            res,
            NextFunction,
            TypeVerify.Access
        );
    }


    public static HandleUserRefreshToken = (refreshTokenReq: RefreshTokenReq, res: Response, NextFunction: NextFunction) => {
        return JWT.verifyToken(refreshTokenReq.refreshToken, RefreshTokenSecret.PUBLICKEY, res, NextFunction, TypeVerify.Refresh);
    }

    public static handleUserSignOut = (req: RefreshTokenReq, res: Response, NextFunction: NextFunction) => {
        return JWT.verifyToken(req.refreshToken, RefreshTokenSecret.PUBLICKEY, res, NextFunction, TypeVerify.SignOut);
    }
}