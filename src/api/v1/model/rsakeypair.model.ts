import mongoose, { Document, Schema } from 'mongoose';

export interface IRSAKeypair {
    publicKey: string;
    privateKey: string;
    initTime: Date;
}

export interface IAuthorModel extends IRSAKeypair, Document {}

const RSAKeypairSchema: Schema = new Schema(
    {
        publicKey: { type: String, required: true },
        privateKey: { type: String, required: true },
        initTime: { type: Date, required: true },

    },
    {
        versionKey: false
    }
);

export default mongoose.model<IRSAKeypair>('RSAKeypair', RSAKeypairSchema);