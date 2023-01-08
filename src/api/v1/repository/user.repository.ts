import mongoose from 'mongoose';
import User, { IUser } from '../model/user.model';

export const saveUser = (_user: IUser) => {
    const userToStore = new User({
        _id: new mongoose.Types.ObjectId(),
        fullname: _user.fullname,
        avatar: _user.avatar,
        email: _user.email,
        phone: _user.phone,
        username: _user.username,
        password: _user.password,
        initTime: new Date()
    });
    return userToStore.save();
}

export const getUserByUsernameAndPassword = (_username: string, _password: string) => {
    return User.findOne({
        username: _username,
        password: _password,
    });
}