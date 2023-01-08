import express from 'express';
import { getUserBy, updateUser, deleteUserBy, saveUser } from '../controller/user.controller';

const userRoute = express.Router();

userRoute.post('/user', saveUser);
userRoute.get('/user', getUserBy);
userRoute.put('/user', updateUser);
userRoute.delete('/user', deleteUserBy);

export = userRoute;