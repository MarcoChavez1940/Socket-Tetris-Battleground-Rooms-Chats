const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();


const server = http.Server(app);
server.listen(3002);

const io = socketIo(server);


io.on('connection', (socket) => {

    socket.on('entry Player', (id_room) => {
        socket.join(id_room);
        socket.broadcast.emit('entry Player', id_room);
    });

    socket.on('leave Player', (id_room) => {
        socket.leave(id_room);
        socket.broadcast.emit('leave Player', id_room);
    });

    socket.on('game_ready', (id_room) => {
        socket.in(id_room).emit('game_ready');
    })

    socket.on('init_game', (data) => {
        socket.in(data.id_room).emit('init_game', data.id_game);
    });




    //new message para un el chat general
    socket.on('new_message_general', (message) => {

        socket.broadcast.emit('new_message_general', {
            id_chat: message.id_chat,
            username: message.username,
            content: message.content
        });

    });

    socket.on('new_message_particular', (message) => {
        socket.in(message.id_chat).emit('new_message_particular', message);
    });

    socket.on('init_chat', (chat) => {
        socket.join(chat.id_chat);

        socket.broadcast.emit('init_chat_' + chat.user_contact, chat);
    });

    socket.on('entry_chat', (id_chat) => {
        socket.join(id_chat);
    })

    socket.on('close_chat', (id_chat) => {
        console.log("Chat cerrado");
        socket.leave(id_chat);
    });


})