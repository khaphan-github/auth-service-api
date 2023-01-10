import { serverConfig } from "../../../../config/server.config";
import { IUserModel } from "../../model/user.model";
import { ResponseBase, ResponseStatus } from "./response.payload";

export interface Token {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    scope: string;
    expriseTime: number;
    href: string,
    method: HttpMethod;
    type: ContextType
}
export interface Method {
    method: HttpMethod;
    type: ContextType
    href: string
}
export const TokenResponse = (accessToken: string, refreshToken: string) => {
    const token: Token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenType: 'Bearer',
        scope: 'server.resources',
        expriseTime: serverConfig.jwt.expriseTime,
        method: HttpMethod.POST,
        type: ContextType.APPLICATIONJSON,
        href: serverConfig.api.path + '/user/oauth/token',
    }
    return token;
}
export interface Publickey {
    publicKey: string;
    href: string;
    method: HttpMethod;
    type: ContextType
}
export enum HttpMethod {
    GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'
}

export enum ContextType {
    APPLICATIONJSON = 'application/json'
}

export const responseClientApplicationOauth = (publicKey: string) => {
    const publicKeyRes: Publickey = {
        publicKey: publicKey,
        method: HttpMethod.POST,
        type: ContextType.APPLICATIONJSON,
        href: serverConfig.api.path + '/user/oauth'
    }

    const _response = ResponseBase(ResponseStatus.SUCCESS, 'Authenticated', publicKeyRes);
    return _response;
};

export interface UserInfo {
    id: string;
    fullname: string;
    avatarUrl: string;
    phone: string;
    email: string;
}
export interface ResponseUserInfoAndToken {
    user: UserInfo;
    token: Token;
}
export const responseUserToken = (accessToken: string, refreshToken: string, IUserModel: IUserModel) => {
    const token = TokenResponse(accessToken, refreshToken);
    const user: UserInfo = {
        id: IUserModel._id,
        fullname: IUserModel.fullname,
        avatarUrl: IUserModel.avatar,
        email: IUserModel.email,
        phone: IUserModel.phone
    }
    const _response: ResponseUserInfoAndToken = {
        token: token,
        user: user
    }
    return _response;
}