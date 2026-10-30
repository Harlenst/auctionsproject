
import { Request, Response } from 'express';
import { HttpError } from '../application/errors/HttpError';
import { ConfirmPayment } from '../application/use-cases/ConfirmPayment';
import { PaymentEvent } from '../domain/entities/PaymentEvent';
import { paymentRepository } from '../infrastructure/repositories/repositories';
import { PaymentWebhookSignature } from '../infrastructure/security/PaymentWebhookSignature';

export const paymentWebhook = async (
    request: Request,
    response: Response
): Promise<void> => {

    const secret = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!secret) {
        throw new HttpError(
            500,
            'WEBHOOK_NOT_CONFIGURED',
            'El secreto del webhook no está configurado'
        );
    }

    const rawBody = (
        request as Request & { rawBody?: Buffer }
    ).rawBody;

    if (!rawBody) {
        throw new HttpError(
            400,
            'MISSING_RAW_BODY',
            'No se pudo obtener el cuerpo original'
        );
    }

    const signature = request.headers['x-webhook-signature'];

    if (
        typeof signature !== 'string' ||
        !PaymentWebhookSignature.verify(rawBody, signature, secret)
    ) {
        throw new HttpError(
            401,
            'INVALID_WEBHOOK_SIGNATURE',
            'Firma del webhook inválida'
        );
    }

    const { id, orderPaymentId, status, createdAt } = request.body;

    if (
        !Number.isSafeInteger(id) || id <= 0 ||
        !Number.isSafeInteger(orderPaymentId) || orderPaymentId <= 0 ||
        status !== 'confirmed' ||
        typeof createdAt !== 'string' ||
        !Number.isFinite(Date.parse(createdAt))
    ) {
        throw new HttpError(
            400,
            'INVALID_WEBHOOK_PAYLOAD',
            'Los datos de la notificación no son válidos'
        );
    }

    const event = new PaymentEvent(
        id,
        orderPaymentId,
        status,
        new Date(createdAt)
    );

    const confirmPayment = new ConfirmPayment(paymentRepository);

    await confirmPayment.execute(event);

    response.status(200).json({
        ok: true,
        message: 'Notificación de pago procesada'
    });
};
