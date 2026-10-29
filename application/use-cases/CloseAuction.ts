
import { Auction } from '../../domain/entities/Auction';
import { PaymentOrder } from '../../domain/entities/PaymentOrder';
import { PaymentRepository } from '../ports/PaymentRepository';

export class CloseAuction {

    constructor(
        private repository: PaymentRepository
    ) {}

    execute(
        auction: Auction,
        paymentOrderId: number
    ): PaymentOrder | null {

        // Evitar generar una segunda orden para la misma subasta.
        const existingOrder = this.repository.getOrderByAuctionId(
            auction.id
        );

        if (existingOrder) {
            return existingOrder;
        }

        // Si ya está cerrada o desierta, no se genera otra orden.
        const status = auction.status.getValue();

        if (status === 'closed' || status === 'deserted') {
            return null;
        }

        // Ejecutar las reglas de cierre del dominio.
        auction.close();

        // Una subasta sin ofertas queda desierta.
        if (auction.status.getValue() === 'deserted') {
            return null;
        }

        // Obtener los datos del ganador.
        const paymentInformation = auction.getPaymentInformation();

        // Crear la orden de pago.
        const paymentOrder = new PaymentOrder(
            paymentOrderId,
            auction.id,
            paymentInformation.winnerId,
            paymentInformation.amount,
            paymentInformation.createdAt,
            paymentInformation.expirationDate,
            'pending'
        );

        // Persistir la orden.
        this.repository.saveOrder(paymentOrder);

        return paymentOrder;
    }
}
