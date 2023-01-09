import express from 'express';
import { getUserBy, updateUser, deleteUserBy, saveUser } from '../controller/user.controller';
import { appClientAuthFillter } from '../middleware/authentication.middleware';

const userRoute = express.Router();

userRoute.post('/user',appClientAuthFillter, saveUser);
userRoute.get('/user',appClientAuthFillter, getUserBy);
userRoute.put('/user',appClientAuthFillter, updateUser);
userRoute.delete('/user',appClientAuthFillter, deleteUserBy);

export = userRoute;