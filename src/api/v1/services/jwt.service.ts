import { Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../../config/serverConfig";
import { RefreshTokenReq } from "../payload/request/refreshToken.req";
import { ContextType, HttpMethod, Method, TokenResponse } from "../payload/Res/clientOauth.res";
import { ResponseBase, ResponseStatus } from "../payload/Res/response.payload";

let refreshTokenList = new Map<string, string>();

export const createAccessToken = (userID: any): string => {
    return jwt.sign({ userID: userID }, serverConfig.jwt.accesskey, { expiresIn: '1h' });
}

export const initRefreshToken = (userID: string): string => {
    const refreshToken = jwt.sign({ userID: userID }, serverConfig.jwt.refreshkey);
    refreshTokenList.set(userID, refreshToken);
    return refreshToken;
}

export const invalidRefreshTokenByUserID = (userID: string) => {
    refreshTokenList.delete(userID);
}
export const isExistRefreshToken = (userID: string): boolean => {
    return refreshTokenList.has(userID);
}

export const handleIsExistRefreshToken = (res: Response) => {
    const HrefMethod: Method = {
        type: ContextType.APPLICATIONJSON,
        href: serverConfig.api.path + '/user/oauth/logout',
        method: HttpMethod.POST,
    }
    const _response = ResponseBase(
        ResponseStatus.SUCCESS,
        'User is signed - logout to authenticate again',
        HrefMethod
    );
    return res.status(200).json({ _response });
}

export const handleUserRefreshToken = (refreshTokenReq: RefreshTokenReq, res: Response) => {
    const isMatchRefreshToken: boolean = refreshTokenList.get(refreshTokenReq.userID) === refreshTokenReq.refreshToken;

    if (isMatchRefreshToken) {
        jwt.verify(refreshTokenReq.refreshToken, serverConfig.jwt.refreshkey, (err, userID) => {
            if (err) {
                const _response = ResponseBase(ResponseStatus.FORBIDDENT, 'Refesh token invalid', err.message);
                return res.status(403).json(_response);
            }

            const accessToken = createAccessToken(userID);
            const newToken = TokenResponse(accessToken, refreshTokenReq.refreshToken);
            const _response = ResponseBase(ResponseStatus.SUCCESS, 'Refesh token success', newToken);

            return res.status(201).json(_response);
        })
    }

    const _response = ResponseBase(ResponseStatus.FORBIDDENT, 'Token is not exist', undefined);
    return res.status(403).json(_response);
}

export const handleUserLogout = (userID: string, res: Response) => {
    if (isExistRefreshToken(userID)) {
        invalidRefreshTokenByUserID(userID);
        const _response = ResponseBase(ResponseStatus.SUCCESS, 'Logout success', undefined);
        return res.status(200).json(_response);
    }

    const _response = ResponseBase(ResponseStatus.FAILURE, 'User is not login yet', undefined);
    return res.status(200).json(_response);
}
