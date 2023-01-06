import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';
import { client } from "../payload/request/client";
import { ResponsePayload, ResponseStatus, Version } from '../payload/ResponsePayload';
import { getKey } from '../services/rsa';
import { isRightClient } from '../validations/client.validate';

export const securityController = express.Router();

securityController.post('/publickey', (request: Request, response: Response) => {
    const _client: client = {
        clientID: request.body.clientID,
        clientSecret: request.body.clientSecret,
    };

    if (isRightClient(_client)) {
        console.log('client already exists');
    }
    else {
        console.log('client NO already exists');
    }

    let key = getKey();

    const _response: ResponsePayload = {
        id: uuidv4(),
        timestemp: Date.now().toString(),
        apiVersion: Version.V1,
        status: ResponseStatus.SUCCESS,
        message: 'get_key_success',
        data: key
    };
    response.json({ _response });
});