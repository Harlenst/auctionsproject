import { Auction } from '../domain/entities/Auction';
import { Bid } from '../domain/entities/Bid';

describe('Auction', () => {

    test('debe aceptar una puja válida', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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

        expect(auction.bids.length).toBe(1);
        expect(auction.getHighestBid()).toBe(bid);
    });

    test('debe rechazar la primera puja menor al precio base', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
            'open'
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            90000,
            new Date()
        );

        expect(() => {
            auction.placeBid(bid);
        }).toThrow(
            'La primera puja debe ser mayor o igual al precio base'
        );

        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar una puja menor al incremento mínimo', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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

        expect(() => {
            auction.placeBid(secondBid);
        }).toThrow(
            'La puja debe superar la puja vigente por el incremento mínimo'
        );

        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar una puja del vendedor', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
            'open'
        );

        const bid = new Bid(
            1,
            auction.sellerId,
            auction.id,
            100000,
            new Date()
        );

        expect(() => {
            auction.placeBid(bid);
        }).toThrow(
            'El vendedor no puede pujar en su propia subasta'
        );

        expect(
            auction.rejectedBidAttempts.length
        ).toBe(1);
    });

    test('debe rechazar que el mejor postor supere su propia puja', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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

        expect(() => {
            auction.placeBid(secondBid);
        }).toThrow(
            'El mejor postor no puede superar su propia puja'
        );
    });

    test('debe cancelar una subasta sin pujas', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
            'open'
        );

        auction.cancel();

        expect(
            auction.status.getValue()
        ).toBe('cancelled');
    });

    test('no debe permitir cancelar una subasta con pujas', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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

        expect(() => {
            auction.cancel();
        }).toThrow(
            'La subasta no puede cancelarse porque ya tiene pujas'
        );
    });

    test('debe cerrar una subasta con pujas', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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
        auction.close();

        expect(
            auction.status.getValue()
        ).toBe('closed');

        expect(
            auction.getWinner()
        ).toBe(bid);
    });

    test('debe marcar como desierta una subasta sin pujas', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
            'open'
        );

        auction.close();

        expect(
            auction.status.getValue()
        ).toBe('deserted');
    });

    test('no debe modificar una subasta cerrada al intentar cerrarla nuevamente', () => {

        const auction = new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date('2026-08-01T10:00:00'),
            new Date('2026-08-02T10:00:00'),
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
    });
});