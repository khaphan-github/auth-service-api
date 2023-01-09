import express from 'express';
import { SecurityController } from '../controller/security.controller';
import { appClientAuthFillter } from '../middleware/authentication.middleware';

const securityRoute = express.Router();

securityRoute.post('/app-client/oauth', SecurityController.appClientAuthenticate);
securityRoute.post('/user/oauth/token', SecurityController.userRefreshToken);
securityRoute.post('/user/oauth/logout', appClientAuthFillter);
securityRoute.post('/user/oauth', SecurityController.userAuthenticate);

export = securityRoute;