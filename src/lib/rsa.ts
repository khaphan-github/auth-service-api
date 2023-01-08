import NodeRSA from "node-rsa";
import { Credentials } from "../api/v1/model/credential.model";

export const generateKey = () => {
    const keys = new NodeRSA({ b: 1024 });
    const publicKey = keys.exportKey('public');
    const privateKey = keys.exportKey('private');

    return {
        publicKey: publicKey,
        privateKey: privateKey
    };
}
export const resEncrypt = (data: any, Publickey: string) => {
    let keyPublic = new NodeRSA(Publickey);
    return keyPublic.encrypt(data, 'base64');
}

const reqDecript = (data: string, Privatekey: string) => {
    let keyPrivate = new NodeRSA(Privatekey);
    return keyPrivate.decrypt(data, 'utf8');
}

export const decryptUsernamePassword = (data: string, Privatekey: string): Credentials => {
    const decryptedData = reqDecript(data, Privatekey);
    return JSON.parse(decryptedData);
}