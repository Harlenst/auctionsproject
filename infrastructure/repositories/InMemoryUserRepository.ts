
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];
    private lastId = 0;

    async getAll(): Promise<User[]> {
        return [...this.users];
    }

    async getById(id: number): Promise<User | undefined> {
        return this.users.find((user) => user.id === id);
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const normalizedEmail = email.trim().toLowerCase();

        return this.users.find(
            (user) => user.email.getValue().toLowerCase() === normalizedEmail
        );
    }

    async generateId(): Promise<number> {
        this.lastId += 1;
        return this.lastId;
    }

    async save(user: User): Promise<void> {
        if (this.users.some((existing) => existing.id === user.id)) {
            throw new Error('Ya existe un usuario con ese ID');
        }

        if (
            this.users.some(
                (existing) =>
                    existing.email.getValue().toLowerCase() ===
                    user.email.getValue().toLowerCase()
            )
        ) {
            throw new Error('Ya existe un usuario con ese correo');
        }

        this.users.push(user);
        this.lastId = Math.max(this.lastId, user.id);
    }
}
