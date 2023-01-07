import RSAKeypair, { IRSAKeypair, IRSAKeypairModel } from "../model/rsakeypair.model";
import { ClientKey } from "../payload/request/ClientKey";
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

export const getRSAPrivateKey = (_publicKey: string): string => {
    let privateKey = '';
    RSAKeypair.findOne({
        publicKey: _publicKey // search query
    })
        .then((keypair) => {
            if (keypair) privateKey = keypair.privateKey;
        })
        .catch((error) => {
            console.error(error);
        });
    return privateKey;
}

export const getPublicKeyByClient = (_client: ClientKey) => {
    return RSAKeypair.findOne({
        clientId: _client.clientId,
        clientSecret: _client.clientSecret
    });
}