
import { Schema, model } from 'mongoose';

const paymentEventSchema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        orderPaymentId: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true
        }
    },
    {
        versionKey: false,
        collection: 'payment_events'
    }
);

export const PaymentEventModel = model(
    'PaymentEvent',
    paymentEventSchema
);
