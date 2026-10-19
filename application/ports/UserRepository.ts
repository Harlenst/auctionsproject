import { User } from '../../domain/entities/User';
export interface UserRepository {
    getAll(): User[];
    getById(id: number): User | undefined;
    getByEmail(email: string): User | undefined;
    generateId(): number;
    save(user: User): void;
}
