// CONFIGURATION CONNECT TO POSTGRE DATABASE AWS
const { Client } = require('pg')
const connectionString = 'postgres://fueitupq:sMOdoNC9YcDJvQ--LhNdYwVQ7nWLcxYI@rosie.db.elephantsql.com/fueitupq';

export const PostgreDatabase = () => {
    const client = new Client(connectionString);
    client.connect((err: { stack: any; }) => {
        if (err) {
          console.error('connection error', err.stack)
        } else {
          console.log('connected')
        }
     });
    return client;
};