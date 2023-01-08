import { Response } from "express";
import { decryptUsernamePassword } from "../../../lib/rsa";
import { IUser } from "../model/user.model";
import { UserReq } from "../payload/request/user.req";
import { getPrivateByPublickey } from "../repository/security.repository";
import { saveUser } from "../repository/user.repository";
import { BcriptHash } from "../../../lib/hash";
export const handleUserRegister = (user: UserReq, res: Response) => {
    // verify otp by email;
    getPrivateByPublickey(user.publicKey).then((keypair) => {
        console.log(user);

        if (keypair) {
            const decryptData = decryptUsernamePassword(user.credential, keypair.privateKey);
            const passwordHash = BcriptHash(decryptData.password);
            console.log(decryptData);
            const iUser: IUser = {
                email: user.email,
                fullname: user.fullname,
                username: decryptData.username,
                avatar: '',
                initTime: new Date(),
                password: passwordHash,
                phone: ''
            }
            saveUser(iUser).then((data) => {
                res.status(201);
            }).catch((err) => {
                res.status(201);
            });
        }

    }).catch((error) => {
        res.status(201);
    });
    res.status(201).end();
}