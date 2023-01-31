import { NextFunction, Response } from "express";
import { BcriptHash } from "../../../lib/hash.lib";
import { DefaultOTP } from "../model/otp.model";
import { IOTPUserData } from "../model/otp.userdata.model";
import { DefaultUserData, IUser } from "../model/user.model";
import { ResponseBase, ResponseStatus } from "../payload/Res/response.payload";
import { sendOTPVerifyEmail } from "./email.service";
import { v4 as uuidv4 } from 'uuid';
import { DefaultOTResponse } from "../payload/Res/otp.res";
import { VerifyOTPReq } from "../payload/request/verifyotp.req";
import { saveUser } from "../repository/user.repository";
import { IUserModelToUserResponse } from "../payload/Res/clientOauth.res";

let OTPMap = new Map<string, IOTPUserData>();

export const generateOTP = () => {
    const MIN_RANGE = 100000;
    const MAX_RANGE = 999999;
    const randomNumber = Math.random() * (MAX_RANGE - MIN_RANGE + 1) + MIN_RANGE;
    return Math.floor(randomNumber).toString();
}
export const handleSendOTPEmail = (
    username: string,
    password: string,
    email: string,
    fullname: string,
    res: Response,
    next: NextFunction) => {

    const OTP = generateOTP();
    const otpID = uuidv4();
    const remainTime = 5;

    const defaultOTPData =
        DefaultOTP(
            otpID,
            OTP,
            email,
            remainTime);

    const defaultUserData =
        DefaultUserData(
            email,
            fullname,
            username,
            BcriptHash(password));

    const _OTPUserData: IOTPUserData = {
        otp: defaultOTPData,
        user: defaultUserData
    }

    OTPMap.set(otpID, _OTPUserData);

    sendOTPVerifyEmail(email, OTP);

    const otpResponse =
        DefaultOTResponse(
            otpID,
            email,
            remainTime);

    const _response =
        ResponseBase(
            ResponseStatus.SUCCESS,
            'OTP generated',
            otpResponse);

    res.status(201).json(_response);
}

export const getUserDataByID = (id: string) => {
    if (OTPMap.has(id)) {
        const data = OTPMap.get(id);
        if (data && data.user) {
            return data.user;
        }
    }
    return undefined;
}
const compareOTP = (id: string, otp: string): boolean => {
    if (OTPMap.has(id)) {
        if (OTPMap.get(id)?.otp.OTP === otp) {
            return true;
        };
    }
    return false;
}
const isInvalidRemaining = (id: string) => {
    // autodelete 
}
const refreshOTP = (id: string) => {
    const storedUserData = OTPMap.get(id) as IOTPUserData;
    storedUserData.otp.OTP = generateOTP();
    OTPMap.set(id, storedUserData);
}

export const handleVerifyOTPByEmail = (
    verifyOTPReq: VerifyOTPReq,
    res: Response,
    next: NextFunction) => {

    const isRightOTP = compareOTP(verifyOTPReq.id, verifyOTPReq.otp);
    if (!isRightOTP) {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                'OTP not match');
        res.status(200).json(_response);
    }

    const userToStore = getUserDataByID(verifyOTPReq.id) as IUser;

    saveUser(userToStore).then((user) => {
        OTPMap.delete(verifyOTPReq.id);
        const userResponse = IUserModelToUserResponse(user);
        const _response =
            ResponseBase(
                ResponseStatus.SUCCESS,
                'Register success',
                { userResponse });
        res.status(201).json(_response);
    }).catch((error) => {
        const _response = ResponseBase(ResponseStatus.ERROR, error.message);
        return res.status(500).json(_response);
    });
}