
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class GetAuction {
    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    async execute(id: number): Promise<Auction | undefined> {
        return await this.repository.getById(id);
    }
}
