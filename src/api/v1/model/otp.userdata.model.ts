import { IOTP } from "./otp.model";
import { IUser } from "./user.model";

export interface IOTPUserData {
    otp: IOTP,
    user: IUser,
}