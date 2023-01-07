import { v4 as uuidv4 } from 'uuid';
import {NextFunction, Request, Response } from 'express';
import { ClientKey } from "../payload/request/ClientKey";
import { ResponsePayload, ResponseStatus, Version } from '../payload/ResponsePayload';
import { getKey } from '../services/rsa';
import { isRightClient } from '../validations/client.validate';


export const getPublickey = (req: Request, res: Response, next: NextFunction) => {
    const _client: ClientKey = {
        clientID: req.body.clientID,
        clientSecret: req.body.clientSecret,
    };
    console.warn(req);
    let key = ''
    if (isRightClient(_client)) {
        console.log('client already exists');
        key = getKey();
    }
    else {
        console.log('client NO already exists');
    }



    const _response: ResponsePayload = {
        id: uuidv4(),
        timestemp: Date.now().toString(),
        apiVersion: Version.V1,
        status: ResponseStatus.SUCCESS,
        message: 'get_key_success',
        data: key
    };
    res.json({ _response });
}