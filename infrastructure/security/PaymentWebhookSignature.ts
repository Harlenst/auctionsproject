
import crypto from 'crypto';

export class PaymentWebhookSignature {

    static verify(
        rawBody: Buffer,
        signature: string,
        secret: string
    ): boolean {

        if (
            !signature ||
            !secret ||
            !/^[a-f0-9]{64}$/i.test(signature)
        ) {
            return false;
        }

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex');

        const received = Buffer.from(signature, 'hex');
        const expected = Buffer.from(expectedSignature, 'hex');

        if (
            received.length !== expected.length ||
            received.length === 0
        ) {
            return false;
        }

        return crypto.timingSafeEqual(received, expected);
    }
}
