
import { User } from '../../domain/entities/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  generateId(): Promise<number>;
  save(user: User): Promise<void>;
}
