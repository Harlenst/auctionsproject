
import { Schema, model } from 'mongoose';

const bidSchema = new Schema(
    {
        id: { type: Number, required: true },
        userId: { type: Number, required: true },
        auctionId: { type: Number, required: true },
        amount: { type: Number, required: true },
        createdAt: { type: Date, required: true }
    },
    { _id: false }
);

const rejectedBidAttemptSchema = new Schema(
    {
        id: { type: Number, required: true },
        userId: { type: Number, required: true },
        auctionId: { type: Number, required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        createdAt: { type: Date, required: true }
    },
    { _id: false }
);

const auctionSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        articleId: { type: Number, required: true },
        sellerId: { type: Number, required: true },
        categoryId: { type: Number, required: true },

        basePrice: { type: Number, required: true },
        minimumIncrement: { type: Number, required: true },

        createdAt: { type: Date, required: true },
        closingAt: { type: Date, required: true },

        status: {
            type: String,
            enum: ['open', 'closed', 'cancelled', 'deserted'],
            required: true
        },

        bids: {
            type: [bidSchema],
            default: []
        },

        rejectedBidAttempts: {
            type: [rejectedBidAttemptSchema],
            default: []
        }
    },
    {
        versionKey: false,
        collection: 'auctions'
    }
);

export const AuctionModel = model(
    'Auction',
    auctionSchema
);
