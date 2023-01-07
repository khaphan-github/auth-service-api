import express from 'express';
import { getPublickey } from '../controller/security.controller';

const securityRoute = express.Router();

securityRoute.post('/publickey', getPublickey);

export = securityRoute;