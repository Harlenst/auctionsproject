
import 'dotenv/config';
import express, { Application } from 'express';
import { createServer } from 'http';

import paymentRouter from './routes/payments';
import userRouter from './routes/users';
import auctionRouter from './routes/auctions';

import { errorMiddleware } from './middleware/errorMiddleware';
import { connectMongoDB } from './infrastructure/database/mongo';
import { initializeSocketServer } from './infrastructure/websocket/SocketServer';

const PORT: number = Number(process.env.PORT) || 5000;

const app: Application = express();

// Crear servidor HTTP compartido
const httpServer = createServer(app);

// Configurar middleware
app.use(express.json());

// Registrar rutas
app.use('/api/v1', userRouter);
app.use('/api/v1', auctionRouter);
app.use('/api/v1', paymentRouter);

// Middleware de errores al final
app.use(errorMiddleware);

async function startServer(): Promise<void> {
    try {
        // Conectar MongoDB
        await connectMongoDB();

        // Inicializar Socket.IO
        initializeSocketServer(httpServer);

        // Iniciar servidor HTTP
        httpServer.listen(PORT, () => {
            console.log(`Server running at ${PORT}`);
            console.log('Socket.IO inicializado correctamente');
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

void startServer();
