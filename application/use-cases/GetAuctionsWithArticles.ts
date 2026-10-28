
import { AuctionRepository } from '../ports/AuctionRepository';
import { ArticleRepository } from '../ports/ArticleRepository';

export class GetAuctionsWithArticles {
    constructor(
        private auctionRepository: AuctionRepository,
        private articleRepository: ArticleRepository
    ) {}

    async execute() {
        const auctions = await this.auctionRepository.getAll();

        const results = await Promise.all(
            auctions.map(async (auction) => {
                const article = await this.articleRepository.getById(
                    auction.articleId
                );

                return {
                    ...auction,
                    article: article ?? null
                };
            })
        );

        return results;
    }
}

