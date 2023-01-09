import { resEncrypt } from "../src/lib/rsa.lib";

test('rsa', () => {
    const dataEncoded = {
        'username': '123',
        'password': '123',
    }
    const publicKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCff6wi08tEr+ujBkDpjm08Lp14\nQV5DVRagNXcR3R3sTBf3PudfTGmg8Cs4hxCJ3CAZ4nsdzAfTqHsQ0773YOe7yGQ1\nq8jj1wFqyotSWlhHiJRAg6Xs3DvbEGQRzxjtxVa/r50Go36F1JV8KTIS4lZMJ+rv\nP/UiXerzfo88tG2BEQIDAQAB\n-----END PUBLIC KEY-----';
    const en = resEncrypt(dataEncoded, publicKey);

    console.log(en);
});

test('hash', () => {
})