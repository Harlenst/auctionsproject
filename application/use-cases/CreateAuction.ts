
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class CreateAuction {
    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    async execute(
        articleId: number,
        sellerId: number,
        categoryId: number,
        basePrice: number,
        minimumIncrement: number,
        createdAt: Date,
        closingAt: Date,
        status: string
    ): Promise<Auction> {

        const id = await this.repository.generateId();

        const auction = new Auction(
            id,
            articleId,
            sellerId,
            categoryId,
            basePrice,
            minimumIncrement,
            createdAt,
            closingAt,
            status
        );

        await this.repository.save(auction);

        return auction;
    }
}
