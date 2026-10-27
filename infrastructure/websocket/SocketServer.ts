
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export function initializeSocketServer(
    httpServer: HttpServer
): Server {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('auction:join', (auctionId: number | string) => {
            const id = Number(auctionId);

            if (!Number.isInteger(id) || id <= 0) {
                socket.emit('auction:error', {
                    message: 'ID de subasta inválido'
                });
                return;
            }

            socket.join(`auction:${id}`);

            socket.emit('auction:joined', {
                auctionId: id
            });

            console.log(
                `Cliente ${socket.id} ingresó a la subasta ${id}`
            );
        });

        socket.on('auction:leave', (auctionId: number | string) => {
            const id = Number(auctionId);

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            socket.leave(`auction:${id}`);

            console.log(
                `Cliente ${socket.id} salió de la subasta ${id}`
            );
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error('El servidor Socket.IO no ha sido inicializado');
    }

    return io;
}
