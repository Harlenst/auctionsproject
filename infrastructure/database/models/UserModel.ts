
import { Schema, model } from 'mongoose';

interface IUserDocument {
  id: number;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUserDocument>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: 'users',
  }
);

export const UserModel = model<IUserDocument>(
  'User',
  userSchema
);
