// Import dependencies && init serverlication express
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { serverConfig } from './src/config/server.config';
import mongoose from 'mongoose';
import securityRoute from './src/api/v1/route/security.route';
import userRoute from './src/api/v1/route/user.route';
import { repairRSAKeypair } from './src/api/v1/services/rsa.service';
import axios from 'axios';
import { CORSMiddleware } from './src/api/v1/middleware/CORS.middleware';
import { JWT } from './src/api/v1/services/jwt/jwt.service';


const server: Application = express();
export const routes = express.Router();

// compress response
const compression = require("compression");
server.use(compression());

// Secure our api
const helmet = require("helmet");
server.use(helmet());

// Use morgan
const morgan = require('morgan');
server.use(morgan('combined'));

// Connect to mongodb
console.info(' ↻ [server]: Waitting for connect to mongodb ...');
mongoose.set('strictQuery', true);
mongoose
  .connect(serverConfig.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    console.info('✅ [server]: Connected to mongodb');
    StartServer();
  })
  .catch((err) => console.error(err))

// Start server
const StartServer = () => {
  // Configure request size
  server.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Configure routes
  server.use(CORSMiddleware);
  server.use(serverConfig.api.path, routes);
  routes.use(securityRoute);
  routes.use(userRoute);

  console.log(` ↺ [server]: Server repair RSA keypair ...`);
  repairRSAKeypair();

  // Start server
  const port = serverConfig.server.port;
  server.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at port:${port}`);
  });

  // job
  JWT.refreshSecretKeyJob();
  // Check IP
  async function getIP() {
    await axios.get('https://api.ipify.org').then((response) => {
      console.log(`[server] IP: ${response.data}`);
    }) 
  }
  getIP();
}