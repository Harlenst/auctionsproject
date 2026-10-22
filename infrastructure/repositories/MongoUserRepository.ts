
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../application/ports/UserRepository';
import { UserModel } from '../database/models/UserModel';
import { CounterModel } from '../database/models/CounterModel';

export class MongoUserRepository implements UserRepository {
  private toDomain(document: {
    id: number;
    name: string;
    email: string;
    password: string;
  }): User {
    return new User(
      document.id,
      document.name,
      document.email,
      document.password
    );
  }

  async getAll(): Promise<User[]> {
    const documents = await UserModel.find().lean().exec();
    return documents.map((document) => this.toDomain(document));
  }

  async getById(id: number): Promise<User | undefined> {
    const document = await UserModel.findOne({ id }).lean().exec();

    return document ? this.toDomain(document) : undefined;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    const document = await UserModel.findOne({
      email: normalizedEmail,
    }).lean().exec();

    return document ? this.toDomain(document) : undefined;
  }

  async generateId(): Promise<number> {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: 'users' },
      { $inc: { sequence: 1 } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    ).exec();

    if (!counter) {
      throw new Error('No fue posible generar el ID del usuario');
    }

    return counter.sequence;
  }

  async save(user: User): Promise<void> {
    try {
      await UserModel.create({
        id: user.id,
        name: user.name,
        email: user.email.getValue().trim().toLowerCase(),
        password: user.password,
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new Error('Ya existe un usuario con ese ID o correo');
      }

      throw error;
    }
  }
}
