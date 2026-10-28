
import { Article } from '../../domain/entities/Article';

export interface ArticleRepository {
    getAll(): Promise<Article[]>;
    getById(id: number): Promise<Article | undefined>;
    generateId(): Promise<number>;
    update(article: Article): Promise<void>;
    save(article: Article): Promise<void>;
}
