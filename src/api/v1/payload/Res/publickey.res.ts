export interface PublicKeyResponse {
    publicKey: string;
    url: string;
    method: HttpMethod;
    type: ContextType
}

export enum HttpMethod {
    GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE', PATCH = 'PATCH'
}

export enum ContextType {
    APPLICATIONJSON = 'application/json'
}