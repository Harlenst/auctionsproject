
import { Article } from '../../domain/entities/Article';
import { ArticleRepository } from '../ports/ArticleRepository';

export class GetArticle {
    constructor(private repository: ArticleRepository) {}

    async execute(id: number): Promise<Article | undefined> {
        return this.repository.getById(id);
    }
}
