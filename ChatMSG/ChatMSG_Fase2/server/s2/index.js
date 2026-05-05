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

const REDIS_URL = "rediss://default:gQAAAAAAAcL1AAIgcDIyOWZiMzUwZTg5OWQ0NzJlODU2YWIxYTUwMGI4MjE4ZQ@able-bug-115445.upstash.io:6379";
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    store: new RedisStore({ 
        client: pubClient,
        prefix: "sess:" 
    }),
    secret: 'secreto-muy-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        secure: false,
        maxAge: 3600000 
    }
}));

const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*", credentials: true } 
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
    try {
        const history = await pubClient.lRange('chat_shared', 0, -1);
        socket.emit('server_history', history.map(m => JSON.parse(m)));
    } catch (e) { console.error(e); }

    socket.on('client_message', async (data) => {
        const newMessage = { 
            user: data.user, 
            text: data.text, 
            time: new Date().toLocaleTimeString(),
            id: Date.now() 
        };
        await pubClient.rPush('chat_shared', JSON.stringify(newMessage));
        io.emit('server_message', newMessage);
    });
});

const PORT = process.env.PORT || 4003;
server.listen(PORT, () => console.log('Servidor en puerto ' + PORT));