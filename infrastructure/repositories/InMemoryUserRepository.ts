import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';

export class InMemoryUserRepository
    implements UserRepository {

    private users: User[] = [];

    getAll(): User[] {
        return this.users;
    }

    getById(id: number): User | undefined {

        return this.users.find((user) => {
            return user.id === id;
        });
    }

    getByEmail(email: string): User | undefined {

        return this.users.find((user) => {
            return user.email.getValue() === email;
        });
    }

    save(user: User): void {
        this.users.push(user);
    }
}