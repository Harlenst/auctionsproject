
import { Schema, model } from 'mongoose';

interface ICounterDocument {
  _id: string;
  sequence: number;
}

const counterSchema = new Schema<ICounterDocument>({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true },
});

export const CounterModel = model<ICounterDocument>(
  'Counter',
  counterSchema
);
