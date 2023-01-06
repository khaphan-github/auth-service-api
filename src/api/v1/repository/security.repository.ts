const PostgreDatabase = require('../../../config/database');

const saveRSAKeypair = (publicKey: string, privateKey: string) => {
    let result = 'Success';
    let queryString = 'INSERT INTO public.rsakey (publicKey, privateKey) VALUES ($1, $2) RETURNING *';
    PostgreDatabase().query(queryString, [publicKey, privateKey], (err: any, results: any) => {
        if (err) { result = 'Failure'; }
    });
    return result;
};
module.exports = saveRSAKeypair;