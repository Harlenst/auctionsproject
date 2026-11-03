
import { Article } from '../../domain/entities/Article';
import { ArticleRepository } from '../ports/ArticleRepository';

export class CreateArticle {
    constructor(private repository: ArticleRepository) {}

    async execute(
        sellerId: number,
        name: string,
        description: string,
        condition: string,
        imageUrl: string
    ): Promise<Article> {

        const id = await this.repository.generateId();

        const article = new Article(
            id,
            sellerId,
            name,
            description,
            condition,
            imageUrl
        );

        await this.repository.save(article);

        return article;
    }
}
