import { Response } from 'express';
import { CACHENAME, MemCache } from '../../../lib/cache.lib';
import { BcriptCompare } from '../../../lib/hash.lib';
import { decryptUsernamePassword, generateKey } from '../../../lib/rsa.lib';
import { IRSAKeypair } from '../model/rsakeypair.model';
import { ClientAccount } from '../payload/request/clientaccount.req';
import { ClientKey } from '../payload/request/clientkey.req';
import { responseClientApplicationOauth, responseUserToken } from '../payload/Res/clientOauth.res';
import { ResponseBase, ResponseStatus } from '../payload/Res/response.payload';
import { getPublicKeyByClient, getRSAKeypair, saveRSAKeypair } from '../repository/security.repository';
import { getUserByUsername } from '../repository/user.repository';
import { Validation } from '../validations/client.validate';
import { JWT } from './jwt/jwt.service';

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

export const initKeyPair = (_client: ClientKey) => {
    const keys = generateKey();
    saveNewRSAKeypair(_client, keys.publicKey, keys.privateKey);
    return keys;
}

export const handleAppClientAuthenticate = async (_client: ClientKey, res: Response) => {
    const isRightClient = Validation.isRightClient(_client);

    if (!isRightClient) {
        const _response = ResponseBase(ResponseStatus.FAILURE, 'Client is not exist');
        return res.status(200).json({ _response });
    }

    const publicKeyCache = await MemCache.getItemFromCacheBy(CACHENAME.PUBLICKEY.toString());
    if (publicKeyCache) {
        const _response = responseClientApplicationOauth(publicKeyCache);
        return res.json(_response).status(200);
    }

    getPublicKeyByClient(_client).then(async (results) => {
        if (results) {
            const _response = responseClientApplicationOauth(results.publicKey);
            await MemCache.setItemFromCacheBy(CACHENAME.PUBLICKEY.toString(), results.publicKey, 60);
            return res.json(_response).status(200);
        }
        else {
            await MemCache.invalidCacheBy();
            const newKeys = initKeyPair(_client);
            await MemCache.setItemFromCacheBy(CACHENAME.PUBLICKEY.toString(), newKeys.publicKey, 6000);
            await MemCache.setItemFromCacheBy(CACHENAME.PRIVATEKEY.toString(), newKeys.privateKey, 6000);

            return res.json(responseClientApplicationOauth(newKeys.publicKey)).status(201);
        }
    }).catch((err) => {
        const _response = ResponseBase(ResponseStatus.FAILURE, 'Server error when call database', err.message);
        return res.json({ _response }).status(500);
    });
}

export const hanldeUserAuthenticate = async (_clientAcc: ClientAccount, res: Response) => {
    await MemCache.getItemFromCacheBy(CACHENAME.PRIVATEKEY.toString()).then((privateKey) => {
        if (privateKey) {
            const clientData = decryptUsernamePassword(_clientAcc.credential, privateKey);

            getUserByUsername(clientData.username).then(async (userStored) => {
                if (userStored && BcriptCompare(clientData.password, userStored.password)) {

                    const tokenKeypair = JWT.initTokenKeypair(userStored._id, userStored.email, userStored.fullname);
                    const responseData =
                        responseUserToken(tokenKeypair.accessToken, tokenKeypair.refreshToken, userStored);
                    const _response = ResponseBase(ResponseStatus.SUCCESS, 'Authenticated', responseData);
                    return res.json(_response).status(200);

                }

                const _response = ResponseBase(ResponseStatus.FAILURE, 'Username or password was incorrect');
                return res.json({ _response }).status(200);

            }).catch((err) => {
                const _response = ResponseBase(
                    ResponseStatus.FAILURE,
                    'Server error when query database',
                    err.message);
                return res.json(_response).status(500);
            });
        }
        else {
            const _response = ResponseBase(
                ResponseStatus.FAILURE,
                'Public Key and Private Key invalid - use /api/v1/app-client/oauth to init new keypair');
            return res.json(_response).status(200);
        }
    }).catch((err) => {
        const _response = ResponseBase(ResponseStatus.WRONG_FORMAT, err.message);
        return res.json(_response).status(500);
    });
}

export const repairRSAKeypair = () => {
    getRSAKeypair().then(async (keypair) => {
        if (keypair) {
            await MemCache.setItemFromCacheBy(CACHENAME.PUBLICKEY.toString(), keypair.publicKey, 6000);
            await MemCache.setItemFromCacheBy(CACHENAME.PRIVATEKEY.toString(), keypair.privateKey, 6000);
        }
    })
}