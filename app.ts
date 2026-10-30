
import 'dotenv/config';
import express, { Application } from 'express';
import { createServer } from 'http';

import paymentRouter from './routes/payments';
import userRouter from './routes/users';
import auctionRouter from './routes/auctions';
import articleRouter from './routes/articles';
import { errorMiddleware } from './middleware/errorMiddleware';
import { connectMongoDB } from './infrastructure/database/mongo';
import { initializeSocketServer } from './infrastructure/websocket/SocketServer';
import cors from 'cors';
const PORT: number = Number(process.env.PORT) || 5000;

const app: Application = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({
    verify: (request, _response, buffer) => {
        (
            request as express.Request & { rawBody?: Buffer }
        ).rawBody = Buffer.from(buffer);
    }
}));

// Crear servidor HTTP compartido
const httpServer = createServer(app);

// Configurar middleware

// Registrar rutas
app.use('/api/v1', userRouter);
app.use('/api/v1', auctionRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', articleRouter);
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
