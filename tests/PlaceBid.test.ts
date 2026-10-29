
import { Auction } from '../domain/entities/Auction';
import { Bid } from '../domain/entities/Bid';
import { PlaceBid } from '../application/use-cases/PlaceBid';
import { AuctionRepository } from '../application/ports/AuctionRepository';
import { PaymentRepository } from '../application/ports/PaymentRepository';

describe('PlaceBid - cierre automático', () => {

    const now = new Date('2026-10-29T10:00:00');

    let auctionRepository: AuctionRepository;
    let paymentRepository: PaymentRepository;

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(now);

        auctionRepository = {
            getAll: jest.fn(),
            getById: jest.fn(),
            generateId: jest.fn(),
            generateBidId: jest.fn(),
            save: jest.fn().mockResolvedValue(undefined)
        } as unknown as AuctionRepository;

        paymentRepository = {
            generateOrderId: jest.fn().mockReturnValue(1),
            getOrderById: jest.fn(),
            getOrderByAuctionId: jest.fn().mockReturnValue(undefined),
            getOrdersByWinnerId: jest.fn(),
            saveOrder: jest.fn(),
            getEventById: jest.fn(),
            saveEvent: jest.fn()
        } as unknown as PaymentRepository;
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    function createAuction(): Auction {
        return new Auction(
            1,
            1,
            100,
            1,
            100000,
            10000,
            new Date(now),
            new Date(now.getTime() + 2 * 60 * 60 * 1000),
            'open'
        );
    }

    test('debe aceptar una oferta cuando la subasta sigue vigente', async () => {

        const auction = createAuction();

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        const useCase = new PlaceBid(
            auctionRepository,
            paymentRepository
        );

        const result = await useCase.execute(auction, bid);

        expect(result).toBe(bid);
        expect(auction.bids).toHaveLength(1);
        expect(auction.status.getValue()).toBe('open');

        expect(auctionRepository.save).toHaveBeenCalledTimes(1);
        expect(paymentRepository.saveOrder).not.toHaveBeenCalled();
    });

    test('debe cerrar una subasta vencida con ofertas y generar una orden', async () => {

        const auction = createAuction();

        const firstBid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        auction.placeBid(firstBid);

        // Simular que ya venció la subasta.
        jest.setSystemTime(
            new Date(now.getTime() + 2 * 60 * 60 * 1000 + 1000)
        );

        const newBid = new Bid(
            2,
            300,
            auction.id,
            120000,
            new Date()
        );

        const useCase = new PlaceBid(
            auctionRepository,
            paymentRepository
        );

        await expect(
            useCase.execute(auction, newBid)
        ).rejects.toThrow(
            'La subasta ha finalizado y no acepta nuevas ofertas'
        );

        expect(auction.status.getValue()).toBe('closed');
        expect(auction.getWinner()).toBe(firstBid);

        expect(paymentRepository.generateOrderId).toHaveBeenCalledTimes(1);
        expect(paymentRepository.saveOrder).toHaveBeenCalledTimes(1);

        expect(auctionRepository.save).toHaveBeenCalledTimes(1);
    });

    test('debe marcar como desierta una subasta vencida sin ofertas', async () => {

        const auction = createAuction();

        // Simular vencimiento.
        jest.setSystemTime(
            new Date(now.getTime() + 2 * 60 * 60 * 1000 + 1000)
        );

        const bid = new Bid(
            1,
            200,
            auction.id,
            100000,
            new Date()
        );

        const useCase = new PlaceBid(
            auctionRepository,
            paymentRepository
        );

        await expect(
            useCase.execute(auction, bid)
        ).rejects.toThrow(
            'La subasta ha finalizado y no acepta nuevas ofertas'
        );

        expect(auction.status.getValue()).toBe('deserted');

        expect(paymentRepository.saveOrder).not.toHaveBeenCalled();
        expect(auctionRepository.save).toHaveBeenCalledTimes(1);
    });

});
