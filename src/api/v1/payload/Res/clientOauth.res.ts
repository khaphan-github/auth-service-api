import { serverConfig } from "../../../../config/serverConfig";
import { ResponseBase, ResponseStatus } from "../response.payload";

export interface ClientOauthRes {
   token: Token,
   publicKey: Publickey
}

export interface Token {
    accessToken: string;
    refreshToken: string;
    expriseTime: number;
    href: string,
    method: HttpMethod;
    type: ContextType
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

export const responseClientApplicationOauth =
    (publicKey: string, accessToken: string, refreshToken: string) => {
        const publicKeyRes: Publickey = {
            publicKey: publicKey,
            method: HttpMethod.POST,
            type: ContextType.APPLICATIONJSON,
            href: serverConfig.api.path + '/oauth'
        }
        const tokenRes: Token = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expriseTime: serverConfig.jwt.expriseTime,
            href: serverConfig.api.path + '/oauth/token',
            method: HttpMethod.POST,
            type: ContextType.APPLICATIONJSON
        }
        const clientOauthResponse: ClientOauthRes = {
            token: tokenRes,
            publicKey: publicKeyRes
        };
        const _response =
            ResponseBase(
                ResponseStatus.SUCCESS,
                'Client_application_oauth_success',
                clientOauthResponse);
        return _response;
    };
