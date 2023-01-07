import mongoose, { Document, Schema } from 'mongoose';

export interface IRSAKeypair {
    clientId: string;
    clientSecret:string;
    publicKey: string;
    privateKey: string;
    initTime: Date;
}

export interface IRSAKeypairModel extends IRSAKeypair, Document {}

const RSAKeypairSchema: Schema = new Schema(
    {
        clientId: { type: String, required: true },
        clientSecret: { type: String, required: true },
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        initTime: { type: Date, required: true },
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IRSAKeypairModel>('RSAKeypair', RSAKeypairSchema);