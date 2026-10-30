
import { Schema, model } from 'mongoose';

const paymentOrderSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },

        auctionId: {
            type: Number,
            required: true,
            unique: true
        },

        winnerId: {
            type: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        createdAt: {
            type: Date,
            required: true
        },

        expirationDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'confirmed', 'expired'],
            required: true,
            default: 'pending'
        }
    },
    {
        versionKey: false,
        collection: 'payment_orders'
    }
);

export const PaymentOrderModel = model(
    'PaymentOrder',
    paymentOrderSchema
);
