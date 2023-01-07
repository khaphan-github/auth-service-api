// Import dependencies && init Application express
import express, { Application } from 'express';
import dotenv from 'dotenv';

const app: Application = express();

const compression = require("compression");
app.use(compression());

const helmet = require("helmet");
app.use(helmet());
// Use morgan
const morgan = require('morgan');
app.use(morgan('combined'));

// Configure request size
import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
dotenv.config();

// Configure routes
export const routes = express.Router();
import { securityController } from './src/api/v1/controller/security.controller';
app.use('/api/v1', routes);
routes.use(securityController);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});