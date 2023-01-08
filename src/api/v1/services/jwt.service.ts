import { Response } from "express";
import jwt from "jsonwebtoken";
import { serverConfig } from "../../../config/serverConfig";

export let refreshTokenList: Array<string> = [];

export const createAccessToken = (userID: string): string => {
    return jwt.sign(
        { userID: userID },
        serverConfig.jwt.accesskey,
        { expiresIn: '1h' }
    );
}

export const initRefreshToken = (userID: string): string => {
    const refreshToken = jwt.sign({ userID: userID }, serverConfig.jwt.refreshkey);
    refreshTokenList.push(refreshToken);
    return refreshToken;
}

export const invalidRefreshToken = (refreshToken: string) => {
    refreshTokenList = refreshTokenList.filter(token => token !== refreshToken);
}
export const getAccessTokenByRefreshToken = (refreshToken: string, userID: string, res: Response) => {
    if (refreshTokenList.includes(refreshToken)) {
        jwt.verify(refreshToken, serverConfig.jwt.refreshkey, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = createAccessToken(userID);
            res.json({ accessToken: accessToken })
        })
    }
}