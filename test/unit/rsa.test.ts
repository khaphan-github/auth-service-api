import { resEncrypt } from "../../src/lib/rsa.lib";

test('rsa', () => {
    const dataEncoded = {
        'username': 'thanhdat@1231FGv',
        'password': 'thanhDat@1231FF',
    }
    const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCV' +
        'XueQ8sh0JnP21jPyi1M1e3t8\n0cJZ9jYy+3VKohNJ03qmuyZDK54CFyja1Wwu5+wHCU9VrA/45p7hZSKioJZw' +
        'Icpq\nlSpb5LeJ5CfJf/rgwcsdDAXegCDycSPJfmuLGtEa8LLb6OREsb0ACCLt0UfgrIC5\nTKUKIKkv5wlM9y' +
        'NIXwIDAQAB\n-----END PUBLIC KEY-----';
    const en = resEncrypt(dataEncoded, publicKey);

    console.log(en);
});