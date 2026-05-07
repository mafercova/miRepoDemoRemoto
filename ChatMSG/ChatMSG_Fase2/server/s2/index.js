require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { RedisStore } = require('connect-redis');

const app = express();

const REDIS_URL = process.env.REDIS_URL;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'chatmsg_session';

const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));

const sessionMiddleware = session({
    store: new RedisStore({
        client: pubClient,
        prefix: "sess:"
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: COOKIE_NAME,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600000
    }
});

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(sessionMiddleware);

const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: CLIENT_ORIGIN, credentials: true } 
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    console.log("Conectado a Redis Remoto");
    io.adapter(createAdapter(pubClient, subClient));
}).catch(err => {
    console.error("Error Redis:", err);
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        req.session.username = username;
        return res.status(200).send({ message: "OK" });
    }
    res.status(400).send("Usuario requerido");
});

io.on('connection', async (socket) => {
    const username = socket.request.session?.username;

    if (!username) {
        socket.emit('auth_error', 'Debes iniciar sesión antes de conectarte al chat');
        socket.disconnect(true);
        return;
    }

    try {
        const history = await pubClient.lRange('chat_shared', 0, -1);
        socket.emit('server_history', history.map(m => JSON.parse(m)));
    } catch (e) { console.error(e); }

    socket.on('client_message', async (data) => {
        const newMessage = { 
            user: username, 
            text: data.text, 
            time: new Date().toLocaleTimeString(),
            id: Date.now() 
        };
        await pubClient.rPush('chat_shared', JSON.stringify(newMessage));
        io.emit('server_message', newMessage);
    });
});

const PORT = process.env.PORT || 4002;
server.listen(PORT, () => console.log('Servidor en puerto ' + PORT));