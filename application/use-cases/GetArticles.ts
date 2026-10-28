
import { Article } from '../../domain/entities/Article';
import { ArticleRepository } from '../ports/ArticleRepository';

export class GetArticles {
    constructor(private repository: ArticleRepository) {}

    async execute(): Promise<Article[]> {
        return this.repository.getAll();
    }
}
