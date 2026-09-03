import { User } from '../../domain/entities/User';

export interface UserRepository {
    getAll(): User[];
    getById(id: number): User | undefined;
    getByEmail(email: string): User | undefined;
    save(user: User): void;
}