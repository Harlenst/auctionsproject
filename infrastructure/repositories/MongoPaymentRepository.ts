import mongoose from 'mongoose';
import { PaymentRepository } from '../../application/ports/PaymentRepository';

import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentEvent } from '../../domain/entities/PaymentEvent';

import { CounterModel } from '../database/models/CounterModel';
import { PaymentOrderModel } from '../database/models/PaymentOrderModel';
import { PaymentEventModel } from '../database/models/PaymentEventModel';

export class MongoPaymentRepository implements PaymentRepository {

    async generateOrderId(): Promise<number> {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'payment_orders' },
            { $inc: { sequence: 1 } },
            {
                upsert: true,
                returnDocument: 'after',
                setDefaultsOnInsert: true
            }
        );

        if (!counter) {
            throw new Error(
                'No fue posible generar el ID de la orden de pago'
            );
        }

        return counter.sequence;
    }

    async getOrderById(
        id: number
    ): Promise<PaymentOrder | undefined> {
        const document = await PaymentOrderModel.findOne({ id })
            .lean()
            .exec();

        if (!document) {
            return undefined;
        }

        return this.orderToDomain(document);
    }

    async getOrderByAuctionId(
        auctionId: number
    ): Promise<PaymentOrder | undefined> {
        const document = await PaymentOrderModel.findOne({ auctionId })
            .lean()
            .exec();

        if (!document) {
            return undefined;
        }

        return this.orderToDomain(document);
    }

    async getOrdersByWinnerId(
        winnerId: number
    ): Promise<PaymentOrder[]> {
        const documents = await PaymentOrderModel.find({ winnerId })
            .lean()
            .exec();

        return documents.map(document => this.orderToDomain(document));
    }

    async saveOrder(order: PaymentOrder): Promise<void> {
        await PaymentOrderModel.findOneAndUpdate(
            { id: order.id },
            {
                $set: {
                    id: order.id,
                    auctionId: order.auctionId,
                    winnerId: order.winnerId,
                    amount: order.amount.getValue(),
                    createdAt: order.createdAt,
                    expirationDate: order.expirationDate,
                    status: order.status
                }
            },
            {
                upsert: true,
                returnDocument: 'after',
                runValidators: true
            }
        );
    }

    async getEventById(
        id: number
    ): Promise<PaymentEvent | undefined> {
        const document = await PaymentEventModel.findOne({ id })
            .lean()
            .exec();

        if (!document) {
            return undefined;
        }

        return new PaymentEvent(
            document.id,
            document.orderPaymentId,
            document.status,
            new Date(document.createdAt)
        );
    }

    async saveEvent(event: PaymentEvent): Promise<void> {
        await PaymentEventModel.findOneAndUpdate(
            { id: event.id },
            {
                $set: {
                    id: event.id,
                    orderPaymentId: event.orderPaymentId,
                    status: event.status,
                    createdAt: event.createdAt
                }
            },
            {
                upsert: true,
                returnDocument: 'after',
                runValidators: true
            }
        );
    }

    private orderToDomain(document: any): PaymentOrder {
        return new PaymentOrder(
            document.id,
            document.auctionId,
            document.winnerId,
            document.amount,
            new Date(document.createdAt),
            new Date(document.expirationDate),
            document.status
        );
    }

    async confirmOrderAndSaveEvent(
        order: PaymentOrder,
        event: PaymentEvent
    ): Promise<void> {
        if (event.status !== 'confirmed') {
            throw new Error('Estado de evento de pago inválido');
        }

        const eventStatus = event.status;

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {

                // 1. Comprobar si el evento ya fue procesado.
                const existingEvent = await PaymentEventModel
                    .findOne({ id: event.id })
                    .session(session)
                    .lean()
                    .exec();

                if (existingEvent) {
                    return;
                }

                // 2. Actualizar la orden dentro de la transacción.
                const updatedOrder = await PaymentOrderModel.findOneAndUpdate(
                    { id: order.id },
                    {
                        $set: {
                            auctionId: order.auctionId,
                            winnerId: order.winnerId,
                            amount: order.amount.getValue(),
                            createdAt: order.createdAt,
                            expirationDate: order.expirationDate,
                            status: order.status
                        }
                    },
                    {
                        session,
                        returnDocument: 'after',
                        runValidators: true
                    }
                );

                if (!updatedOrder) {
                    throw new Error('La orden de pago no existe');
                }

                // 3. Guardar el evento dentro de la misma transacción.
                await PaymentEventModel.create(
                    [{
                        id: event.id,
                        orderPaymentId: event.orderPaymentId,
                        status: eventStatus,
                        createdAt: event.createdAt
                    }],
                    { session }
                );
            });

        } finally {
            await session.endSession();
        }
    }

}
