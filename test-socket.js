
const { io } = require('socket.io-client');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const URL = 'http://localhost:5000';
const AUCTION_ID = Number(process.env.AUCTION_ID || 3);

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => resolve(answer.trim()));
    });
}

async function connectClient(name, token) {
    const client = io(URL, {
        auth: { token }
    });

    client.on('connect', () => {
        console.log(`[${name}] Conectado: ${client.id}`);
        client.emit('auction:join', AUCTION_ID);
    });

    client.on('auction:joined', data => {
        console.log(`[${name}] Suscrito a subasta:`, data.auctionId);
    });

    client.on('auction:error', data => {
        console.error(`[${name}] ERROR DE SUBASTA:`, data.message);
    });

    client.on('bid:created', data => {
        console.log(`[${name}] NUEVA PUJA:`, data);
    });

    client.on('bid:outbid', data => {
        console.log(`[${name}] TU PUJA FUE SUPERADA:`, data);
    });

    client.on('auction:closed', data => {
        console.log(`[${name}] SUBASTA CERRADA:`, data);
    });

    client.on('connect_error', error => {
        console.error(`[${name}] Error de conexión:`, error.message);
    });

    return client;
}

async function main() {
    console.log('=== PRUEBA SOCKET.IO: DOS CLIENTES ===');

    const tokenA = await ask('JWT del usuario A: ');
    const tokenB = await ask('JWT del usuario B: ');

    if (!tokenA || !tokenB) {
        console.error('Debes proporcionar ambos JWT.');
        rl.close();
        return;
    }

    const clientA = await connectClient('CLIENTE A', tokenA);
    const clientB = await connectClient('CLIENTE B', tokenB);

    console.log('\nAmbos clientes están intentando conectarse.');
    console.log('Presiona Ctrl+C para finalizar la prueba.');

    process.on('SIGINT', () => {
        clientA.disconnect();
        clientB.disconnect();
        rl.close();
        process.exit(0);
    });
}

main().catch(error => {
    console.error('Error en la prueba:', error);
    rl.close();
});
