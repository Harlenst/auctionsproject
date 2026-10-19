
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];
    private lastId = 0;

    getAll(): User[] {
        return this.users;
    }

    getById(id: number): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    getByEmail(email: string): User | undefined {
        return this.users.find(
            (user) => user.email.getValue() === email
        );
    }

    generateId(): number {
        this.lastId += 1;
        return this.lastId;
    }

    save(user: User): void {
        if (this.getById(user.id) !== undefined) {
            throw new Error('Ya existe un usuario con ese ID');
        }

        if (this.getByEmail(user.email.getValue()) !== undefined) {
            throw new Error('Ya existe un usuario con ese correo');
        }

        this.users.push(user);
        this.lastId = Math.max(this.lastId, user.id);
    }
}
