import dotenv from 'dotenv';

dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';

const MONGODB_URL = `mongodb+srv://
${MONGODB_USERNAME}:${MONGODB_PASSWORD}
@clusternvirginia.6dnisja.mongodb.net/webrtc`;

const SERVER_PORT = process.env.PORT || 3000;

const API_PATH = process.env.API_PATH ? process.env.API_PATH : '/api/v1';

const MAIL_USERNAME = process.env.MAIL_SERVER_USERNAME;
const MAIL_PASSWORD = process.env.MAIL_SERVER_PASSWORD;

export const serverConfig = {
  mongo: {
    url: MONGODB_URL
  },
  server: {
    port: SERVER_PORT
  },
  api: {
    path: API_PATH
  },
  mailServer: {
    username: MAIL_USERNAME,
    password: MAIL_PASSWORD
  }
}