import axios from 'axios';

describe('User_Authentication_interation_testing', () => {

    const requestConfig = (data: any) => {
        return {
            method: 'post',
            url: 'http://localhost:3000/api/v1/user/oauth',
            headers: {},
            data: data
        };
    }

    test('TestUserAuthentication_WhenGivenRightCredential_DoesStatusSuccessAndAccessTokenAndUserInfo', async () => {
        /** Data encoded {
            'username': 'thanhdat@1231FGv',
            'password': 'thanhDat@1231FF',
         }
         Publickey: '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVXueQ8s' +
            'h0JnP21jPyi1M1e3t8\n0cJZ9jYy+3VKohNJ03qmuyZDK54CFyja1Wwu5+wHCU9VrA/45p7hZSKioJZwIcpq\nlS' +
            'pb5LeJ5CfJf/rgwcsdDAXegCDycSPJfmuLGtEa8LLb6OREsb0ACCLt0UfgrIC5\nTKUKIKkv5wlM9yNIXwIDAQAB' +
            '\n-----END PUBLIC KEY-----';
         */
        const credential = 'ZWe2KXI54CZUzLoQVMuQ13TTn8Ai0Sf7SIDUJ8vHUYSQcYIIlwPi20ATU7rGzd8nweJupM1kK' +
            '91ddOvpv4cgawmOkJNgUlFZ3hs12n+WlE1+uFvnDVEpsVtZ9FKoOcg/UxMml2h6+Arx5JuWlQir1FP26N97V8P4O73yxDtZ/cc=';

        const _config = requestConfig({
            'credential': credential
        });

        await axios(_config).then((response) => {
            expect(response.data.status).toMatch('SUCCESS');
            expect(response.data.data.token.accessToken).toHaveLength(465);
            expect(response.data.data.user.id).toMatch('63bebbdbf51ba59e1ddc1ee5');
        })
    });

    test('TestUserAuthenticate_WhenGivenWrongFormatCredential_DoesStatusWrongFormat', async () => {

        const credential = 'ZWe2KXI54CZUzLoQVMuQ13TTn8Ai0Sf7SIDUJ8vHUYSQcYIIlwPi20ATU7rGzd8nweJupM1kK' +
            '91ddOvpv4cgawmOkJNgUlFZ3hs12n+WlE1+uFvnDVEpsVtZ9FKoOcg/UxMml97V8P4O73yxDtZ/cc=';

        const _config = requestConfig({
            'credential': credential
        });

        const expectedMessage = 'Error during decryption (probably incorrect key).' +
            ' Original error: Error: Incorrect data or key';

        await axios(_config).then((response) => {
            expect(response.data.status).toMatch('WRONG_FORMAT');
            expect(response.data.message).toMatch(expectedMessage);
        })

    });

    test('TestUserAuthenticate_WhenGivenEmptyCredential_Does', async () => {
       
    });
    test('TestUserAuthenticate_WhenGivenEmptyUserNameInCredential_Does', async () => {
       
    });
    
    test('TestUserAuthenticate_WhenGivenEmptyPasswordInCredential_Does', async () => {
       
    });
    test('TestUserAuthenticate_WhenGivenEmptyBothUserNameAndPasswordInCredential_Does', async () => {
       
    });
    test('TestUserAuthenticate_WhenGivenEmplyUserNameInCredential_Does', async () => {
       
    });
    test('TestUserAuthenticate_WhenGivenEmplyUserNameInCredential_Does', async () => {
       
    });
})

describe('User sign out test', () => {
    const config = (data: any) => {
        return {
            method: 'post',
            url: 'http://localhost:3000/api/v1/user/oauth/logout',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
    }
    test('Should receive FORBIDDENT when given invalid refresh token', async () => {
        const _config = config(JSON.stringify({
            'accessToken': 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2JlYmJkYmY1MWJhNTllMWRkYzFlZTUiLCJzY29wZSI6InVzZXIiLCJlbWFpbCI6InBoYW5ob2FuZ2toYTAxQGdtYWlsLmNvbSIsIm5hbWUiOiJMZSBEbyBUaGFuaCBEYXQiLCJpYXQiOjE2NzM5Njc0MTMsImV4cCI6MTY3Mzk2NzcxMywianRpIjoiNjkxNDRiNmMtNjM2YS00NjdhLThjNzktNjRkYjI3MGVmYWE0In0.ACcMRGPpT7mv09VwWbQZ4AVsUDXomCgLRBkEEeLSVeKwIhmPS6yN9qoWk8vh_3-KQJmPDT16tuLmlbG1N_J6X9A0AaTiTv2ia-S1ZbqxujIabUGXyBygF30J227QrOyjNzwJa203DYggQOuDuVDPMLDmz6Aua6Zx6-_eRUEk5ekEvv85',
            'refreshToken': 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2JlYmJkYmY1MWJhNTllMWRkYzFlZTUiLCJzY29wZSI6InVzZXIiLCJlbWFpbCI6InBoYW5ob2FuZ2toYTAxQGdtYWlsLmNvbSIsIm5hbWUiOiJMZSBEbyBUaGFuaCBEYXQiLCJpYXQiOjE2NzM5Njc0MTMsImV4cCI6MTY3Mzk2ODAxMywianRpIjoiOWExZmY0MzktMjlmYi00Nzc0LTkxYzMtNWEwNGQ3YWY5Nzc3In0.AFwgcfek3kmnfJOW2JqVuJ5Tnx77m01F5NdRjhWVgMYxy9f0L1bFGMDwqMC9LeLceETAxoA6NVzqeewJBBW-u4dBAW53TO9XHJWfpMCaIuHOKImnlSz-TsjyHzhR1gEq75cSIH9Y2H9O2GtLFJ59p0bSDfFcGWFDrxrhaMuGNe22L0t_'
        }))
        await axios(_config).then((response) => {
            expect(response.data.status).toMatch('FORBIDDENT');
            expect(response.data.message).toMatch('Token invalid');
        }).catch((err) => {
            expect(err.message).toMatch('Request failed with status code 403');
        })
    });
})