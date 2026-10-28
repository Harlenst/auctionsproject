
import { Article } from '../../domain/entities/Article';
import { ArticleRepository } from '../ports/ArticleRepository';

export class UpdateArticle {
    constructor(
        private readonly articleRepository: ArticleRepository
    ) {}

    async execute(
        id: number,
        name: string,
        description: string,
        condition: string,
        imageUrl: string
    ): Promise<Article | undefined> {
        const existingArticle = await this.articleRepository.getById(id);

        if (!existingArticle) {
            return undefined;
        }

        const updatedArticle = new Article(
            id,
            name,
            description,
            condition,
            imageUrl
        );

        await this.articleRepository.update(updatedArticle);

        return updatedArticle;
    }
}
