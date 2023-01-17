export interface JWTModel {
    sub:string;
    scope: string
    email: string;
    name: string;
    iat: number;
    exp: number;
    jti: string;
}