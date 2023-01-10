import dotenv from 'dotenv';

dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';
const MONGODB_URL =
  `mongodb+srv://
${MONGODB_USERNAME}:${MONGODB_PASSWORD}
@clustersingapore.b43lfcm.mongodb.net/webrtc`;

const SERVER_PORT = process.env.PORT || 3000;

const API_PATH = process.env.API_PATH ? process.env.API_PATH : '/api/v1';

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET_KEY ?
    process.env.JWT_ACCESS_SECRET_KEY :
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeKcfnEI8MdWhTWcMuHJLgxty';

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET_KEY ?
    process.env.JWT_REFRESH_SECRET_KEY :
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeKcfnEI8MdWhTWcMuHJLgxty';

const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME ? Number(process.env.JWT_EXPIRE_TIME) : 3600;

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
  jwt: {
    accesskey: JWT_ACCESS_SECRET,
    refreshkey: JWT_REFRESH_SECRET,
    expriseTime: JWT_EXPIRE_TIME
  },
  memoryCache: {
    
  }
}