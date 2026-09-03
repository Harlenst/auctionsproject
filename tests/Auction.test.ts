import { Auction } from '../domain/entities/Auction';
import { Bid } from '../domain/entities/Bid';

describe('Auction', () => {

    test('debe aceptar una puja válida', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        // RN-08: La primera puja debe ser mayor o igual al precio base.
        auction.placeBid(bid);

        expect(auction.bids.length).toBe(1);
        expect(auction.getHighestBid()).toBe(bid);
    });

    test('debe rechazar la primera puja menor al precio base', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            90000,
            new Date()
        );

        // RN-08: La primera puja menor al precio base debe rechazarse.
        expect(() => {
            auction.placeBid(bid);
        }).toThrow(
            'La primera puja debe ser mayor o igual al precio base'
        );

        // RN-12: La puja rechazada queda registrada.
        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar una puja menor al incremento mínimo', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const firstBid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(firstBid);

        const secondBid = new Bid(
            2,
            300,
            auction.id,
            105000,
            new Date()
        );

        // RN-09: La nueva puja debe superar la vigente por el incremento mínimo.
        expect(() => {
            auction.placeBid(secondBid);
        }).toThrow(
            'La puja debe superar la puja vigente por el incremento mínimo'
        );

        // RN-12: La puja rechazada queda registrada.
        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar una puja del vendedor', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            auction.sellerId,
            auction.id,
            100000,
            new Date()
        );

        // RN-07: El vendedor no puede pujar en su propia subasta.
        expect(() => {
            auction.placeBid(bid);
        }).toThrow(
            'El vendedor no puede pujar en su propia subasta'
        );

        // RN-12: La puja rechazada queda registrada.
        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar que el mejor postor supere su propia puja', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const firstBid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(firstBid);

        const secondBid = new Bid(
            2,
            200,
            auction.id,
            120000,
            new Date()
        );

        // RN-10: El mejor postor no puede superar su propia puja.
        expect(() => {
            auction.placeBid(secondBid);
        }).toThrow(
            'El mejor postor no puede superar su propia puja'
        );
    });

    test('debe cancelar una subasta sin pujas', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        // RN-04: Una subasta sin pujas puede cancelarse.
        auction.cancel();

        expect(
            auction.status.getValue()
        ).toBe('cancelled');
    });

    test('no debe permitir cancelar una subasta con pujas', () => {

        const createdAt = new Date();
        const closingAt = new Date(
            createdAt.getTime() + 24 * 60 * 60 * 1000
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(bid);

        // RN-04: Una subasta con pujas no puede cancelarse.
        expect(() => {
            auction.cancel();
        }).toThrow(
            'La subasta no puede cancelarse porque ya tiene pujas'
        );
    });

    test('debe cerrar una subasta con pujas', () => {

        jest.useFakeTimers();

        const createdAt = new Date('2026-09-03T10:00:00');
        const closingAt = new Date('2026-09-04T10:00:00');

        jest.setSystemTime(
            new Date('2026-09-03T10:00:00')
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(bid);

        // Avanzamos el tiempo hasta después del cierre.
        jest.setSystemTime(
            new Date('2026-09-04T10:01:00')
        );

        // RN-13: Si hay pujas, existe una puja ganadora al cerrar.
        auction.close();

        expect(
            auction.status.getValue()
        ).toBe('closed');

        expect(
            auction.getWinner()
        ).toBe(bid);

        jest.useRealTimers();
    });

    test('debe marcar como desierta una subasta sin pujas', () => {

        jest.useFakeTimers();

        const createdAt = new Date('2026-09-03T10:00:00');
        const closingAt = new Date('2026-09-04T10:00:00');

        jest.setSystemTime(
            new Date('2026-09-03T10:00:00')
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        // Avanzamos el tiempo hasta después del cierre.
        jest.setSystemTime(
            new Date('2026-09-04T10:01:00')
        );

        // RN-14: Una subasta sin pujas queda como desierta.
        auction.close();

        expect(
            auction.status.getValue()
        ).toBe('deserted');

        jest.useRealTimers();
    });

    test('no debe modificar una subasta cerrada al intentar cerrarla nuevamente', () => {

        jest.useFakeTimers();

        const createdAt = new Date('2026-09-03T10:00:00');
        const closingAt = new Date('2026-09-04T10:00:00');

        jest.setSystemTime(
            new Date('2026-09-03T10:00:00')
        );

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            createdAt,
            closingAt,
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(bid);

        jest.setSystemTime(
            new Date('2026-09-04T10:01:00')
        );

        // RN-16: La subasta solo puede cerrarse una vez.
        auction.close();

        const firstStatus =
            auction.status.getValue();

        auction.close();

        expect(
            auction.status.getValue()
        ).toBe(firstStatus);

        expect(
            auction.bids.length
        ).toBe(1);

        jest.useRealTimers();
    });
});