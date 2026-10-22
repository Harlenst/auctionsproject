import 'dotenv/config';
import express, { Application } from 'express';
import paymentRouter from './routes/payments';
import userRouter from './routes/users';
import auctionRouter from './routes/auctions';
import { errorMiddleware } from './middleware/errorMiddleware';
import { connectMongoDB } from './infrastructure/database/mongo';
const PORT: number = Number(process.env.PORT) || 5000;

const app: Application = express();

app.use(express.json());

app.use('/api/v1', userRouter);
app.use('/api/v1', auctionRouter);
app.use('/api/v1', paymentRouter);
// Debe registrarse después de las rutas.
app.use(errorMiddleware);

async function startServer(): Promise<void> {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

void startServer();