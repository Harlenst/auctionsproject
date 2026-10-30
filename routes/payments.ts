
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

import {
    getMyPaymentOrders,
    expireMyPaymentOrder
} from '../controllers/payments';

import {
    paymentWebhook
} from '../controllers/PaymentWebhookController';

const paymentRouter = Router();

// Webhook público: la autenticación se realiza mediante HMAC.
paymentRouter.post('/payments/webhook', paymentWebhook);

// Rutas privadas de pagos.
paymentRouter.get(
    '/payments/my-orders',
    authMiddleware,
    getMyPaymentOrders
);

paymentRouter.post(
    '/payments/my-orders/:id/expire',
    authMiddleware,
    expireMyPaymentOrder
);

export default paymentRouter;
