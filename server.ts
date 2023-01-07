// Import dependencies && init serverlication express
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { serverConfig } from './src/config/serverConfig';
import mongoose from 'mongoose';
import securityRoute from './src/api/v1/route/security.route';

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
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

  server.use(serverConfig.api.path, routes);
  routes.use(securityRoute);

  // Start server
  const port = serverConfig.server.port;
  server.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
  });
}