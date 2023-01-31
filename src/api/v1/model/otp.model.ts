export interface IOTP {
    id: string
    OTP: string;
    verifyEmail: string;
    expiration_time: Date;
    created_at: Date;
    updated_at: Date;
    isVerified: boolean;
    remaining: number;
}

export const DefaultOTP = (_id:string,otp: string, email: string, expriseMinutes: number) => {
    const createdAt = new Date();
    const OTP: IOTP = {
        id: _id,
        OTP: otp,
        verifyEmail: email,
        created_at: createdAt,
        expiration_time: AddMinutesToDate(createdAt, expriseMinutes),
        updated_at:createdAt,
        isVerified: false,
        remaining: 5,
    }
    return OTP;
}

const AddMinutesToDate = (date:Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
}
