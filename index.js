const http = require('http');
const express = require('express');
const cors = require('cors');
const { Socket } = require('socket.io');

// config de .env
require('dotenv').config();

// creamos app de express
const app = express();

// config app de Express
app.use(cors())

// creacion del servidor
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`servidor escuchando en puerto ${PORT}`);
})

// configuracion de Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

// 任何一个外界用户链接我们的servidor, 这里我们进行链接，suscribir监听
io.on('connection', (socket) => {
    console.log('se ha conectado un nuevo cliente');

    // mando un mensaje a todos los clientes conectados menos al que se conecta
    socket.broadcast.emit('mansaje_chat', {
        usuario: 'INFO', mensaje: 'Se ha conectado un nuevo usuario'
    });

    // actualizo el numero de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    // 让socket监听/suscribirt 前端传来的,，名为mensaje_chat的信息。
    // 后端可以看见前端发来的信息
    socket.on('mensaje_chat', (data) => {
        console.log(data);
        io.emit('mensaje_chat', data)
    });

    // suscribir el usuariuo que desconectar
    socket.on('disconnect', () => {
        // mandar mensaje a los que conectados
        io.emit('mensaje_chat', {
            usuario: 'INFO', mensaje: 'Se ha desconectrado un usuaro'
        });
        // actualizar de nuevo el num de clientes conectados
        io.emit('cliente_conectados', io.engine.clientsCount)
    })
})
