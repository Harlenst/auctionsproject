
import { Auction } from '../domain/entities/Auction';
import { Bid } from '../domain/entities/Bid';
import { GetAuction } from '../application/use-cases/GetAuction';
import { AuctionRepository } from '../application/ports/AuctionRepository';
import { PaymentRepository } from '../application/ports/PaymentRepository';

describe('GetAuction - cierre automático', () => {
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
            1, 1, 100, 1, 100000, 10000,
            new Date(now),
            new Date(now.getTime() + 2 * 60 * 60 * 1000),
            'open'
        );
    }

    test('debe devolver una subasta vigente sin cerrarla', async () => {
        const auction = createAuction();

        (auctionRepository.getById as jest.Mock)
            .mockResolvedValue(auction);

        const useCase = new GetAuction(
            auctionRepository,
            paymentRepository
        );

        const result = await useCase.execute(auction.id);

        expect(result).toBe(auction);
        expect(auction.status.getValue()).toBe('open');
        expect(auctionRepository.save).not.toHaveBeenCalled();
        expect(paymentRepository.saveOrder).not.toHaveBeenCalled();
    });

    test('debe cerrar una subasta vencida con ofertas y generar una orden', async () => {
        const auction = createAuction();

        const firstBid = new Bid(
            1, 200, auction.id, 100000, new Date()
        );

        auction.placeBid(firstBid);

        jest.setSystemTime(
            new Date(now.getTime() + 2 * 60 * 60 * 1000 + 1000)
        );

        (auctionRepository.getById as jest.Mock)
            .mockResolvedValue(auction);

        const useCase = new GetAuction(
            auctionRepository,
            paymentRepository
        );

        const result = await useCase.execute(auction.id);

        expect(result).toBe(auction);
        expect(auction.status.getValue()).toBe('closed');
        expect(auction.getWinner()).toBe(firstBid);
        expect(paymentRepository.generateOrderId).toHaveBeenCalledTimes(1);
        expect(paymentRepository.saveOrder).toHaveBeenCalledTimes(1);
        expect(auctionRepository.save).toHaveBeenCalledTimes(1);
    });

    test('debe marcar como desierta una subasta vencida sin ofertas', async () => {
        const auction = createAuction();

        jest.setSystemTime(
            new Date(now.getTime() + 2 * 60 * 60 * 1000 + 1000)
        );

        (auctionRepository.getById as jest.Mock)
            .mockResolvedValue(auction);

        const useCase = new GetAuction(
            auctionRepository,
            paymentRepository
        );

        const result = await useCase.execute(auction.id);

        expect(result).toBe(auction);
        expect(auction.status.getValue()).toBe('deserted');
        expect(paymentRepository.saveOrder).not.toHaveBeenCalled();
        expect(auctionRepository.save).toHaveBeenCalledTimes(1);
    });

    test('debe devolver undefined cuando la subasta no existe', async () => {
        (auctionRepository.getById as jest.Mock)
            .mockResolvedValue(undefined);

        const useCase = new GetAuction(
            auctionRepository,
            paymentRepository
        );

        const result = await useCase.execute(999);

        expect(result).toBeUndefined();
        expect(auctionRepository.save).not.toHaveBeenCalled();
        expect(paymentRepository.saveOrder).not.toHaveBeenCalled();
    });
});
