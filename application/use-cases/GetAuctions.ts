
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class GetAuctions {
    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Auction[]> {
        return await this.repository.getAll();
    }
}
