
import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
    getMyPaymentOrders,
    expireMyPaymentOrder
} from '../controllers/payments';
const paymentRouter = Router();

paymentRouter.get('/payments/my-orders', authMiddleware, getMyPaymentOrders);
paymentRouter.post('/payments/my-orders/:id/expire', authMiddleware, expireMyPaymentOrder);

export default paymentRouter;
