
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class CreateAuction {
    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    execute(
        articleId: number,
        sellerId: number,
        categoryId: number,
        basePrice: number,
        minimumIncrement: number,
        createdAt: Date,
        closingAt: Date,
        status: string
    ): Auction {
        const id = this.repository.generateId();

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

        this.repository.save(auction);

        return auction;
    }
}
