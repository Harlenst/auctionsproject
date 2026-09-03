export class Email {

    private value: string;

    constructor(value: string) {

        if (!value.includes('@')) {
            throw new Error(
                'Correo electrónico inválido'
            );
        }

        this.value = value;
    }

    getValue(): string {
        return this.value;
    }
}