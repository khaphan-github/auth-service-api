import { NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/ClientKey";
import { ResponseBase, ResponseStatus } from '../payload/ResponsePayload';
import { isRightClient } from '../validations/client.validate';
import { getPublicKeyByClient } from '../repository/security.repository';
import { initKeyPair } from '../services/rsa';
import { ContextType, HttpMethod, PublicKeyResponse } from '../payload/Res/publickey.res';
import { serverConfig } from '../../../config/serverConfig';


export const getPublickey = (req: Request, res: Response, next: NextFunction) => {
    const _client: ClientKey = {
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
    };
    if (isRightClient(_client)) {
        getPublicKeyByClient(_client).then((results) => {
            const resPublicKey = (publicKey: string, message: string, status: number) => {
                const publicKeyResponse: PublicKeyResponse = {
                    publicKey: publicKey,
                    method: HttpMethod.POST,
                    type: ContextType.APPLICATIONJSON,
                    url: serverConfig.api.path + '/client/authorize'
                };
                const _response =
                    ResponseBase(
                        ResponseStatus.SUCCESS,
                        message,
                        publicKeyResponse);
                res.json({ _response }).status(status);
            };

            if (results) {
                resPublicKey(results.publicKey, 'get_public_key_success', 200);
            }
            else {
                const newPublicKey = initKeyPair(_client);
                resPublicKey(newPublicKey, 'init_key_pair_success', 201);
            }
        }).catch((err) => {
            const _response =
                ResponseBase(
                    ResponseStatus.FAILURE,
                    'server_error_when_call_database',
                    err.message);
            res.json({ _response }).status(500);
        });
    } else {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                'client_is_not_exist',
                undefined);
        res.json({ _response }).status(200);
    }
}