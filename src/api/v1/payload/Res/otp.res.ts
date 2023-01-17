import { serverConfig } from "../../../../config/server.config";
import { AddMinutesToDate } from "../../model/otp.model";
import { ContextType, HttpMethod } from "./clientOauth.res";

export interface OTPResponse {
    id: string;
    verifyEmail: string;
    expiration_time: Date;
    created_at: Date;
    updated_at: Date;
    isVerified: boolean;
    remaining: number;
    href: string,
    method: HttpMethod;
    type: ContextType
}

export const DefaultOTResponse = (_id: string, email: string, expriseMinutes: number) => {
    const createdAt = new Date();
    const OTP: OTPResponse = {
        id: _id,
        verifyEmail: email,
        created_at: createdAt,
        expiration_time: AddMinutesToDate(createdAt, expriseMinutes),
        updated_at: createdAt,
        isVerified: false,
        remaining: 5,
        method: HttpMethod.POST,
        type: ContextType.APPLICATIONJSON,
        href: serverConfig.api.path + '/user/otp',
    }
    return OTP;
}