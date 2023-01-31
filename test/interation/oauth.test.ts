import axios from 'axios';

describe('App_client_authenticate_interation_testing', () => {

    const requestConfig = (data: any) => {
        return {
            method: 'post',
            url: 'http://localhost:3000/api/v1/app-client/oauth',
            headers: {},
            data: data
        };
    }

    test('TestClientAuthenticate_WhenGivenClientIDAndClientSecret_DoesPublicKey', async () => {
        const _oauthConfig = requestConfig({
            "clientId": "9f8faca3-ff0e-4f38-ba0a-a898ad98c31e",
            "clientSecret": "e198c72fda9984d4c28f846550fdd91e"
        });

        const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVXueQ8s' +
            'h0JnP21jPyi1M1e3t8\n0cJZ9jYy+3VKohNJ03qmuyZDK54CFyja1Wwu5+wHCU9VrA/45p7hZSKioJZwIcpq\nlS' +
            'pb5LeJ5CfJf/rgwcsdDAXegCDycSPJfmuLGtEa8LLb6OREsb0ACCLt0UfgrIC5\nTKUKIKkv5wlM9yNIXwIDAQAB' +
            '\n-----END PUBLIC KEY-----';

        await axios(_oauthConfig).then((response) => {
            expect(response.data.status).toMatch('SUCCESS');
            expect(response.data.data.publicKey).toBe(publicKey)
        })
    });

    test('TestClientAuthenticate_WhenGivenWrongClientSecrect_DoesMessageClientIsNotExist', async () => {
        const _oauthConfig = requestConfig({
            "clientId": "9f8faca3-ff0e-4f38-ba0a-a898ad98c31e",
            "clientSecret": "e198c72fda9984d4c28f"
        });
        
        await axios(_oauthConfig).then((response) => {
            expect(response.data.status).toMatch('FAILURE');
            expect(response.data.message).toBe('Client is not exist');
        })
    });

    test('TestClientAuthenticate_WhenGivenWrongClientIDAndClientSecret_DoesMessageClientIsNotExist', async () => {
        const _oauthConfig = requestConfig({
            "clientId": "9f8faca3-ff0e-4f38-ba0a",
            "clientSecret": "e198c72fda9984d4c2891e"
        });
        await axios(_oauthConfig).then((response) => {
            expect(response.data.status).toMatch('FAILURE');
            expect(response.data.message).toBe('Client is not exist');
        })
    });

    test('TestClientAuthenticate_WhenGivenEmptyClientIDAndClientSecrect_DoesStatusFailure', async () => {
        const _oauthConfig = requestConfig({});
        await axios(_oauthConfig).then((response) => {
            expect(response.data.status).toMatch('FAILURE');
            expect(response.data.message).toBe('Client is not exist');
        })
    });
});
