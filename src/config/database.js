// CONFIGURATION CONNECT TO POSTGRE DATABASE AWS
const { Client } = require('pg')
const connectionString = 'postgres://fueitupq:sMOdoNC9YcDJvQ--LhNdYwVQ7nWLcxYI@rosie.db.elephantsql.com/fueitupq';

const PostgreDatabase = () => {
    const client = new Client(connectionString);
    client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack)
        } else {
          console.log('connected')
        }
     });
    return client;
};

module.exports = PostgreDatabase;