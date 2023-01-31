import { NextFunction, Response } from "express";
import { decryptDataByPrivateKey } from "../../../lib/rsa.lib";
import { UserReq } from "../payload/request/user.req";
import { CACHENAME, MemCache } from "../../../lib/cache.lib";
import { Validation } from "../validations/client.validate";
import { ResponseBase, ResponseStatus } from "../payload/Res/response.payload";
import { getExistUserByUsername } from "../repository/user.repository";
import { handleSendOTPEmail } from "./otp.service";

export const handleUserRegister = async (
    user: UserReq,
    res: Response,
    next: NextFunction) => {

    await MemCache.getItemFromCacheBy(CACHENAME.PRIVATEKEY).then((privateKey) => {
        console.log(user);
        if (privateKey) {
            const decryptData = decryptDataByPrivateKey(user.credential, privateKey);

            const responseValidate =
                verifyUserInput(
                    user.email,
                    user.fullname,
                    decryptData.username,
                    decryptData.password);

            if (responseValidate) {
                return res.status(200).json(responseValidate);
            }
            getExistUserByUsername(decryptData.username).then((existUser) => {
                if (existUser) {
                    console.log(existUser.username);
                    const _response =
                        ResponseBase(
                            ResponseStatus.FAILURE,
                            'Username already exist - please try again with other username');
                    return res.status(200).json(_response);
                }
                handleSendOTPEmail(
                    decryptData.username,
                    decryptData.password,
                    user.email,
                    user.fullname,
                    res,
                    next);

            }).catch((err) => {
                const _response =
                    ResponseBase(
                        ResponseStatus.ERROR,
                        'Query database failure',
                        err.message);
                return res.status(500).json(_response);
            });
        }
    }).catch((decriptError) => {
        console.log(decriptError);
        const response = ResponseBase(
            ResponseStatus.ERROR,
            decriptError.message);
        return res.status(500).json(response);

    }).catch((memoryCacheError) => {
        const response = ResponseBase(
            ResponseStatus.ERROR,
            memoryCacheError.message);
        return res.status(500).json(response);
    });
};

const verifyUserInput = (email: string, fullname: string, username: string, password: string) => {
    if (!Validation.isRightEmail(email)) {
        return ResponseBase(
            ResponseStatus.WRONG_FORMAT,
            'Email wrong format: example@mailserver.com');
    }
    if (!Validation.isRightFullname(fullname)) {
        return ResponseBase(
            ResponseStatus.WRONG_FORMAT,
            'Fullname length must be more than 10 character');
    }
    if (!Validation.isPasswordRole(password)) {
        return ResponseBase(
            ResponseStatus.WRONG_FORMAT,
            'Password wrong format: contain upercase, lowercase, non character, number, length more than 8 character');
    }
    if (!Validation.isRightUsername(username)) {
        return ResponseBase(
            ResponseStatus.WRONG_FORMAT,
            'Username wrong format: length must be more than 15 character');
    }
}

