import { NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/ClientKey";
import { ResponseBase, ResponseStatus } from '../payload/ResponsePayload';
import { isRightClient } from '../validations/client.validate';
import { getPublicKeyByClient } from '../repository/security.repository';
import { initKeyPair, saveNewRSAKeypair } from '../services/rsa';


export const getPublickey = (req: Request, res: Response, next: NextFunction) => {
    const _client: ClientKey = {
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
    };
    if (isRightClient(_client)) {
        getPublicKeyByClient(_client)
            .then((results) => {
                if (results) {
                    const _response =
                        ResponseBase(
                            ResponseStatus.SUCCESS,
                            'get_key_success',
                            results.publicKey);
                    res.json({ _response });
                }
                else {
                    const newPublicKey = initKeyPair(_client);
                    const _response =
                        ResponseBase(
                            ResponseStatus.SUCCESS,
                            'get_key_success',
                            newPublicKey);
                    res.json({ _response });
                }
            })
            .catch((err) => {
                const _response =
                    ResponseBase(
                        ResponseStatus.FAILURE,
                        'get_key_success',
                        err.message);
                res.json({ _response });
            });
    }
    else {
        const _response =
            ResponseBase(
                ResponseStatus.FAILURE,
                'client_is_not_esixt',
                _client);
        res.json({ _response });
    }
}