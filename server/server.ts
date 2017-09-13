import * as express from 'express';
import * as path from 'path';
import {User} from './User';
import * as sio from "socket.io";
import * as http from "http";

let httpServer = http.createServer();
let io = sio(httpServer, { transports: [ "websocket" ] });
let app = express();
//import http = require('http').Server(app);
//let http = require('http').Server(app);
let users = [];
let map = [new User("0", 100, 100, "dmg")];
app.get('/', function(req, res) {
    res.sendfile(path.join('..', '/client/'));
});

function deluser(users, ip) {
    let out = [];
    for (let u of users) {
        if (u.ip !== ip) {
            out.push(u);
        }
    }
    return out;
}

io.on('connection', function(socket) {
    let len = socket.handshake.address.split(':').length - 1;
    let ip = socket.handshake.address.split(':')[len];
    io.to(socket.id).emit('map', map);
    users.push(new User(ip, Math.random() * 500, Math.random() * 500, 'user'));
    socket.on('move', function(dir) {
        let coll = users.concat(map);
        console.log(coll);
        if (dir === 'up') {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].up(1, coll);
                }
            }
        }
        if (dir === 'down')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].down(1, coll);
                }
            }
        }
        if (dir === 'left')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].left(1, coll);
                }
            }
        }
        if (dir === 'right')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].right(1, coll);
                }
            }
        }
        io.emit('users', users);
    });

    socket.on('disconnect', function(socket) {
        users = deluser(users, ip);
    });
});

httpServer.listen(3001, function() {
    console.log('listening on *:3001');
});