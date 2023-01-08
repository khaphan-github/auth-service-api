import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    fullname: string;
    avatar: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    initTime: Date;
}

export interface IUserModel extends IUser, Document { }

const IUserSchema: Schema = new Schema(
    {
        fullname: { type: String, required: true },
        avatar: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: false, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        initTime: { type: Date, required: true },
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IUserModel>('User', IUserSchema);