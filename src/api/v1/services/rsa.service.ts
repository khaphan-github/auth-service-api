import { Response } from 'express';
import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import { decryptUsernamePassword, generateKey } from '../../../lib/rsa';
import { IRSAKeypair } from '../model/rsakeypair.model';
import { ClientAccount } from '../payload/request/clientaccount.req';
import { ClientKey } from '../payload/request/clientkey.req';
import { responseClientApplicationOauth } from '../payload/Res/clientOauth.res';
import { ResponseBase, ResponseStatus } from '../payload/response.payload';
import { getPrivateByPublickey, getPublicKeyByClient, saveRSAKeypair } from '../repository/security.repository';
import { getUserByUsernameAndPassword } from '../repository/user.repository';
import { Validation } from '../validations/client.validate';
import { createAccessToken, initRefreshToken } from './jwt.service';


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
const clientOauthResponseCache = new CacheContainer(new MemoryStorage());

export const handleAppClientAuthenticate = async (_client: ClientKey, res: Response) => {
    const isRightClient = Validation.isRightClient(_client);
    if (!isRightClient) {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                'client_is_not_exist',
                undefined);
        res.status(200).json({ _response });
        return;
    }
    const cachedRes = await clientOauthResponseCache.getItem<any>("oauthResponse");

    if (cachedRes) {
        res.json(cachedRes).status(200);
        return;
    }

    getPublicKeyByClient(_client).then(async (results) => {
        if (results) {
            const accesstoken = createAccessToken(results.id);
            const refreshToken = initRefreshToken(results.id);
            const _response = responseClientApplicationOauth(
                results.publicKey
                , accesstoken, refreshToken);
            res.json(_response).status(200);

            await clientOauthResponseCache.setItem("oauthResponse", _response, { ttl: 60 })
        }
        else {
            const newPublicKey = initKeyPair(_client);
            res.json(responseClientApplicationOauth(newPublicKey
                , '', '')).status(201);
        }
    }).catch((err) => {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                'server_error_when_call_database',
                err.message);
        res.json({ _response }).status(500);
    });
}

export const hanldeUserAuthenticate = (_clientAcc: ClientAccount, res: Response) => {
    getPrivateByPublickey(_clientAcc.publicKey).then((keypair) => {
        if (keypair) {
            const data = decryptUsernamePassword(_clientAcc.credential, keypair.privateKey);
            console.log(data);
            getUserByUsernameAndPassword(data.username, data.password).then((user) => {
                if (user) {
                    const _response =
                        ResponseBase(
                            ResponseStatus.SUCCESS,
                            'Authentication_Success_here_is_user_information',
                            user);
                    res.json({ _response }).status(200);
                }
                else {
                    const _response =
                        ResponseBase(
                            ResponseStatus.FAILURE,
                            'Username_or_password_was_wrong',
                            undefined);
                    res.json({ _response }).status(200);
                }
            }).catch((err) => {
                const _response =
                    ResponseBase(
                        ResponseStatus.FAILURE,
                        'Server_error_when_call_database',
                        err.message);
                res.json({ _response }).status(500);
            });
        }
    }).catch((err) => {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                err.message,
                undefined);
        res.json({ _response }).status(500);
    });
}