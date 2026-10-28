
export class Article {
    id: number;
    name: string;
    description: string;
    condition: string;
    imageUrl: string;

    constructor(
        id: number,
        name: string,
        description: string,
        condition: string,
        imageUrl: string
    ) {
        if (!name.trim()) {
            throw new Error('El nombre del artículo es obligatorio');
        }

        if (!description.trim()) {
            throw new Error('La descripción del artículo es obligatoria');
        }

        if (!condition.trim()) {
            throw new Error('La condición del artículo es obligatoria');
        }

        this.id = id;
        this.name = name.trim();
        this.description = description.trim();
        this.condition = condition.trim();
        this.imageUrl = imageUrl.trim();
    }
}
