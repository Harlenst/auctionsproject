
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
        imageUrl: string,
        sellerId: number
    ): Promise<Article | undefined> {

        const existingArticle =
            await this.articleRepository.getById(id);

        if (!existingArticle) {
            return undefined;
        }

        // Verificar que el artículo pertenezca al vendedor.
        if (existingArticle.sellerId !== sellerId) {
            throw new Error(
                'No tienes permiso para modificar este artículo'
            );
        }

        const updatedArticle = new Article(
            id,
            existingArticle.sellerId,
            name,
            description,
            condition,
            imageUrl
        );

        await this.articleRepository.update(updatedArticle);

        return updatedArticle;
    }
}
