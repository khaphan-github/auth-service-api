import RSAKeypair, { IRSAKeypair } from "../model/rsakeypair.model";
import { ClientKey } from "../payload/request/clientkey.req";
import mongoose from 'mongoose';

export const saveRSAKeypair = (rsaKeypair: IRSAKeypair) => {
    const rsaKeypairToSave = new RSAKeypair({
        _id: new mongoose.Types.ObjectId(),
        clientId: rsaKeypair.clientId,
        clientSecret: rsaKeypair.clientSecret,
        initTime: rsaKeypair.initTime,
        publicKey: rsaKeypair.publicKey,
        privateKey: rsaKeypair.privateKey
    });
    rsaKeypairToSave.save()
        .then((rsaKeypairToSave) => {
            console.log(rsaKeypairToSave);
            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        })
}

export const getPublicKeyByClient = (_client: ClientKey) => {
    return RSAKeypair.findOne({
        clientId: _client.clientId,
        clientSecret: _client.clientSecret
    }).select('publicKey');
}

export const getPrivateByPublickey = (publicKey: string) => {
    return RSAKeypair.findOne({
        publicKey: publicKey
    }).select('privateKey');
}

export const getRSAKeypair = () => {
    return RSAKeypair.findOne().select(['publicKey', 'privateKey']);
}