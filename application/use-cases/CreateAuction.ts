
import { Auction } from '../../domain/entities/Auction';
import { AuctionRepository } from '../ports/AuctionRepository';
import { ArticleRepository } from '../ports/ArticleRepository';

export class CreateAuction {
    constructor(
        private auctionRepository: AuctionRepository,
        private articleRepository: ArticleRepository
    ) {}

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

        // 1. Validar que el artículo exista
        const article = await this.articleRepository.getById(articleId);

        if (!article) {
            throw new Error('No existe el artículo asociado a esta subasta');
        }

        // 2. Generar identificador único
        const id = await this.auctionRepository.generateId();

        // 3. Construir la entidad de dominio
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

        // 4. Persistir la subasta
        await this.auctionRepository.save(auction);

        return auction;
    }
}
