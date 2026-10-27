
const { io } = require('socket.io-client');

const client = io('http://localhost:5000');

client.on('connect', () => {
    console.log('Cliente conectado:', client.id);

    client.emit('auction:join', 3);
});

client.on('auction:joined', (data) => {
    console.log('Escuchando subasta:', data.auctionId);
});

client.on('bid:created', (data) => {
    console.log('NUEVA OFERTA RECIBIDA');
    console.log('Subasta:', data.auctionId);
    console.log('Oferta:', data.bid);
    console.log('Mensaje:', data.message);
});

client.on('connect_error', (error) => {
    console.error('Error:', error.message);
});
