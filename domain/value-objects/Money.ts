export class Money {

    private value: number;

    constructor(value: number) {

        if (value < 0) {
            throw new Error(
                'El valor monetario no puede ser negativo'
            );
        }

        if (!Number.isInteger(value)) {
            throw new Error(
                'El valor monetario debe ser un número entero'
            );
        }

        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}