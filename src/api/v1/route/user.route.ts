import express from 'express';
import { getUserBy, updateUser, deleteUserBy, saveUser, verifyOTP } from '../controller/user.controller';
import { appClientAuthFillter } from '../middleware/authentication.middleware';
import { RateLimit } from '../middleware/ratelimit.middleware';

const userRoute = express.Router();

userRoute.post('/user', saveUser);
userRoute.get('/user', appClientAuthFillter, getUserBy);
userRoute.put('/user', appClientAuthFillter, updateUser);
userRoute.delete('/user', appClientAuthFillter, deleteUserBy);
userRoute.post('/user/otp', RateLimit(10, 5), verifyOTP);

export default userRoute;