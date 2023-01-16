import { Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWTModel } from "../../model/jwt.model";
import { TokenKeypairModel } from "../../model/tokenkeypair.model";
import { RefreshTokenReq } from "../../payload/request/refreshToken.req";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import * as schedule from "node-schedule";
import child_process from 'child_process';
import { MemCache } from "../../../../lib/cache.lib";
import { ResponseBase, ResponseStatus } from "../../payload/Res/response.payload";

const enum RefreshTokenSecret {
    PUBLICKEY = 'es512-public-refresh-token.pem',
    PRIVATEKEY = 'es512-private-refresh-token.pem'
}
const enum AccessTokenSecret {
    PUBLICKEY = 'es512-public-access-token.pem',
    PRIVATEKEY = 'es512-private-access-token.pem'
}

/** JWT ROLE ♥
 * 1. Openssl to generate public key and private key both access token and refresh token ♪
 * 2. ES256 algorithms was used for best security ♪
 * 3. Every 10 minutes refresh key pairs be call to generate new key pair for more security ♪
 * 4. Access token exprise time in 5 minutes, refresh token is 10 minutes ♪
 * 5. Refresh token valid when access token invalid ♪
 * 6. When refresh token call before it valid this token be push to blacklist
 * 7. When user sign out token key pairs be push to blacklist then system have new recret;
 * 7. Khi thay dổi thuật toán - trường hợp mà client còn hạn token mà thuật toán thay đỗi thì khôgn giải mã được, 
 * 8. When user login by different device;
 */

export class JWT {

    private static BlackListRefreshToken: Array<string> = new Array<string>();

    /** Job call every 10 minutes to refresh */
    public static refreshSecretKeyJob() {
        JWT.prepareJWTSecret();
        schedule.scheduleJob({ start: new Date(Date.now()), rule: '*/10  * * * *' }, () => {
            console.log('⚡️ [server - job] Refresh JWT secret key at', Date.now());
            JWT.prepareJWTSecret();
        });
    }

    private static moveSecretKeytoCache = async () => {
        const expriseTime = 60 * 10;
        await MemCache.setItemFromCacheBy(RefreshTokenSecret.PUBLICKEY,
            JWT.getKeyFromFile(RefreshTokenSecret.PUBLICKEY), expriseTime);

        await MemCache.setItemFromCacheBy(RefreshTokenSecret.PRIVATEKEY,
            JWT.getKeyFromFile(RefreshTokenSecret.PRIVATEKEY), expriseTime);

        await MemCache.setItemFromCacheBy(AccessTokenSecret.PUBLICKEY,
            JWT.getKeyFromFile(AccessTokenSecret.PUBLICKEY), expriseTime);

        await MemCache.setItemFromCacheBy(AccessTokenSecret.PRIVATEKEY,
            JWT.getKeyFromFile(AccessTokenSecret.PRIVATEKEY), expriseTime);
    }

    public static prepareJWTSecret = () => {
        JWT.moveSecretKeytoCache();

        JWT.generateKeyByShellScript(AccessTokenSecret.PUBLICKEY, AccessTokenSecret.PRIVATEKEY);
        JWT.generateKeyByShellScript(RefreshTokenSecret.PUBLICKEY, RefreshTokenSecret.PRIVATEKEY);
    }

    private static generateKeyByShellScript = (tokenPublic: string, tokenPrivate: string) => {
        const workPath = 'src/api/v1/services/jwt/key';
        const genPrivateKeyProcess =
            child_process.spawn('openssl',
                ['ecparam', '-genkey', '-name', 'secp521r1', '-noout', '-out', tokenPrivate],
                { cwd: workPath }
            );

        genPrivateKeyProcess.on('close', (code) => {
            if (code === 0) {
                child_process.spawn('openssl', ['ec', '-in', tokenPrivate, '-pubout', '-out', tokenPublic],
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
            expiresIn: 60 * 15, // 10 minutes
            notBefore: 60 * 4,
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

    public static verifyAccessToken = (accessToken: string, res: Response, NextFunction: NextFunction) => {
        const keyFromFile = JWT.getKeyFromFile(AccessTokenSecret.PUBLICKEY);
        const option: VerifyOptions = {
            algorithms: ['ES512']
        }
        const errResponse = ResponseBase(ResponseStatus.FORBIDDENT, 'Token invalid');

        jwt.verify(accessToken, keyFromFile, option, async (err, decoded) => {
            if (err?.name === 'JsonWebTokenError') {
                const keyFromCache = await MemCache.getItemFromCacheBy(AccessTokenSecret.PUBLICKEY);
                if (!keyFromCache) {
                    return res.status(401).json(ResponseBase(ResponseStatus.FORBIDDENT, err.message));
                }
                jwt.verify(accessToken, keyFromCache, option, (err, decoded) => {
                    if (err) {
                        return res.status(401).json(errResponse);
                    }
                    NextFunction();
                });
            }
            if (err?.name === 'TokenExpiredError' || err?.name === 'NotBeforeError') {
                return res.status(401).json(errResponse);
            }
            NextFunction();
        });
    }

    public static verifyRefreshToken = (refreshToken: string): boolean => {
        const refreshTokenPublicKey = JWT.getKeyFromFile(RefreshTokenSecret.PUBLICKEY);
        try {
            const option: VerifyOptions = {
                algorithms: ['ES512']
            }
            jwt.verify(refreshToken, refreshTokenPublicKey, option, (err, decoded) => {
                if (err?.name === 'NotBeforeError') {
                    // move access to black lish;
                    // Notifi cation,
                }
            });

            return false;
        } catch (error) {
            // Hanlde error
            console.log(error);
            return false;
        }
    }

    public static isExistRefreshTokenInBlackList = (userID: string, refreshToken: string) => {

    }

    public static pushRefreshTokenTobBlackList = (userID: string, refreshToken: string) => {
        // const blackListKeyPair = BlackListToken.get(userID)?.push(refreshToken);
        // BlackListToken.set(userID,blackListKeyPair);
        // luwuw refresh token cho ddeesn thi it time out;

        // taạ thời điêm logout - token phải dissable ngay - 
        // trường hợp 1:
        /** Khi hacker có cả refresh token và access token - 
         * Client luôn refresh token - Khi mà hacker refresh token trước - server sẽ đưa vô black list
         * đến giờ refresh token của client - server sẽ báo nó nằm trong black list - 
         * refresh token đúng giờ .... 
         */
    }
    // Kiểm tra refresh to ken hoặc access token trong black list thì ấy;
    public static RefreshToken = (refreshTokenReq: RefreshTokenReq, res: Response) => {
        // jwt.verify(refreshTokenReq.refreshToken, serverConfig.jwt.refreshkey, (err, user) => {
        //     if (user) {
        //         const userData = user as JWTModel;
        //         const tokenKeypair = JWT.initTokenKeypair(userData.userID);
        //         const newToken = TokenResponse(tokenKeypair.accessToken, tokenKeypair.refreshToken);
        //         // invalid accesss token;

        //         const _response = ResponseBase(ResponseStatus.SUCCESS, 'Refesh token success', newToken);
        //         return res.status(201).json(_response);
        //     }
        //     if (err) {
        //         const _response = ResponseBase(ResponseStatus.WRONG_FORMAT, 'Refesh wrong format', err.message);
        //         return res.status(400).json(_response);
        //     }
        // });
    }

    public static handleUserSignOut = (req: RefreshTokenReq, res: Response) => {
        /** Add access and refresh token to black list - when token invalid empty blacklist 
         * how inmplement it with best performance'''
        */
        res.end();
    }
}
