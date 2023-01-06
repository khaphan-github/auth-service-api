const saveRSAKeypair = require('../../src/api/v1/repository/security.repository');


it('should save RSA key', () => {
    const result = saveRSAKeypair('publicKey', 'privateKey');
    console.log(result);
});