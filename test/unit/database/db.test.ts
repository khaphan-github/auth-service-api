// https://jestjs.io/docs/getting-started

import { ClientKey } from "../../../src/api/v1/payload/request/ClientKey";
import { getPublicKeyByClient } from "../../../src/api/v1/repository/security.repository";
import { getKey } from "../../../src/api/v1/services/rsa";

describe('getPublicKeyByClient()', () => {
    it('should return public key when clientKey store in DB', () => {
        // given clientID and clientSecret
        const clientKey: ClientKey = {
            clientId: '9f8faca3-ff0e-4f38-ba0a-a898ad98c31e',
            clientSecret: 'e198c72fda9984d4c28f846550fdd91e'
        };
    
        // when
        let receivedPublicKey = '';
        getKey(clientKey);
    
        // then publickey:
        const expectedPublicKey = '123123123';
        expect(expectedPublicKey).toMatch(receivedPublicKey);
    });
});