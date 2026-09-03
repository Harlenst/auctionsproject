import { Email } from '../value-objects/Email';

export class User {

    id: number;
    name: string;
    email: Email;
    password: string;

    constructor(
        id: number,
        name: string,
        email: string,
        password: string
    ) {

        this.id = id;
        this.name = name;
        this.email = new Email(email);
        this.password = password;
    }
}