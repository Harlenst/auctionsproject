
import { Article } from '../../domain/entities/Article';
import { ArticleRepository } from '../../application/ports/ArticleRepository';
import { ArticleModel } from '../database/models/ArticleModel';
import { CounterModel } from '../database/models/CounterModel';

export class MongoArticleRepository implements ArticleRepository {

    private toDomain(document: {
        id: number;
        name: string;
        description: string;
        condition: string;
        imageUrl: string;
    }): Article {
        return new Article(
            document.id,
            document.name,
            document.description,
            document.condition,
            document.imageUrl
        );
    }

    async getAll(): Promise<Article[]> {
        const documents = await ArticleModel.find()
            .lean()
            .exec();

        return documents.map(document => this.toDomain(document));
    }

    async getById(id: number): Promise<Article | undefined> {
        const document = await ArticleModel.findOne({ id })
            .lean()
            .exec();

        return document
            ? this.toDomain(document)
            : undefined;
    }

    async generateId(): Promise<number> {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: 'articles' },
            { $inc: { sequence: 1 } },
            {
                upsert: true,
                returnDocument: 'after', setDefaultsOnInsert: true
            }
        ).exec();

        if (!counter) {
            throw new Error('No fue posible generar el ID del artículo');
        }

        return counter.sequence;
    }
    async update(article: Article): Promise<void> {
        const result = await ArticleModel.updateOne(
            { id: article.id },
            {
                $set: {
                    name: article.name,
                    description: article.description,
                    condition: article.condition,
                    imageUrl: article.imageUrl
                }
            }
        ).exec();

        if (result.matchedCount === 0) {
            throw new Error('El artículo no fue encontrado');
        }
    }

    async save(article: Article): Promise<void> {
        await ArticleModel.create({
            id: article.id,
            name: article.name,
            description: article.description,
            condition: article.condition,
            imageUrl: article.imageUrl
        });
    }
}
