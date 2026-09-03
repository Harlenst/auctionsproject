import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';

export class GetAuction {

    private repository: AuctionRepository;

    constructor(repository: AuctionRepository) {
        this.repository = repository;
    }

    execute(id: number): Auction | undefined {
        return this.repository.getById(id);
    }
}