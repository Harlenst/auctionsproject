export class Money {

    private value: number;

    constructor(value: number) {

        if (value < 0) {
            throw new Error('Money cannot be negative');
        }

        if (!Number.isInteger(value)) {
            throw new Error('Money must be an integer');
        }

        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
} 