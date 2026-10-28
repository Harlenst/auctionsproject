
import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        condition: {
            type: String,
            required: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        versionKey: false,
        collection: 'articles'
    }
);

export const ArticleModel = model(
    'Article',
    articleSchema
);
