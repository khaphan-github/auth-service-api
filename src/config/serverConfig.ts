import dotenv from 'dotenv';

dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@clustersingapore.b43lfcm.mongodb.net/webrtc`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const API_PATH = process.env.API_PATH ?  process.env.API_PATH : '/api/v1';

export const serverConfig = {
  mongo: {
    url: MONGODB_URL
  },
  server: {
    port: SERVER_PORT
  },
  api: {
    path: API_PATH
  }
}