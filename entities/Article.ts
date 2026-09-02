export class Article {

    id: number;
    name: string;
    description: string;
    condition: string;

    constructor(
        id: number,
        name: string,
        description: string,
        condition: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.condition = condition;
    }
}