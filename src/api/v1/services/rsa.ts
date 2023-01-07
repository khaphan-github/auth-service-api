import console = require('console');
import { NextFunction } from 'express';
import NodeRSA = require('node-rsa');
import { IRSAKeypair, IRSAKeypairModel } from '../model/rsakeypair.model';
import { ClientKey } from '../payload/request/ClientKey';
import { getPublicKeyByClient, getRSAPrivateKey, saveRSAKeypair } from '../repository/security.repository';

export const generateKey = () => {
    const keys = new NodeRSA({ b: 1024 });
    const publicKey = keys.exportKey('public');
    const privateKey = keys.exportKey('private');

    return {
        publicKey: publicKey,
        privateKey: privateKey
    };
}
export const resDecript = (data: string, key: string) => {
    let keyPrivate = new NodeRSA(key);
    let decrypted = keyPrivate.decrypt(data, 'utf8');
    return decrypted;
}

export const saveNewRSAKeypair = (_client: ClientKey, publicKey: string, privateKey: string) => {
    const keyStore: IRSAKeypair = {
        clientId: _client.clientId,
        clientSecret: _client.clientSecret,
        initTime: new Date,
        publicKey: publicKey,
        privateKey: privateKey
    }
    saveRSAKeypair(keyStore);
}

export const initKeyPair = (_client: ClientKey): string => {
    const keys = generateKey();
    saveNewRSAKeypair(_client, keys.publicKey, keys.privateKey);
    return keys.publicKey;
}
