let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');
let users = [];
app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '..', '/client/'));
});

class user {
    constructor(ip, x, y) {
        this.ip = ip;
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
    }

    collision(box1, box2) {
        if ((box2.x >= box1.x + box1.w) || (box2.x + box2.w <= box1.x) || (box2.y >= box1.y + box1.h) || (box2.y + box2.h <= box1.y)) {
            return false;
        } else {
            return true;
        }
    }

    verif_coll(objs, next_pos) {
        let object_coll = new Array();
        for (let i = 0; i < objs.length; i++) {
            if (this.collision(next_pos, objs[i]) == true && next_pos.ip !== objs[i].ip) {
                object_coll.push(objs[i]);
            }
        }
        if (object_coll[0] != undefined) {
            return object_coll;
        }
        return false;
    }


    up(speed, objs) {
        let next_pos = {
            ip: this.ip,
            x: this.x,
            y: this.y - speed,
            w: this.w,
            h: this.h
        }
        if (this.verif_coll(objs, next_pos) === false) {
            this.y -= speed;
            if (this.y < 0) {
                this.y = 0;
            }
        }
    }

    down(speed, objs) {
        let next_pos = {
            ip: this.ip,
            x: this.x,
            y: this.y + speed,
            w: this.w,
            h: this.h
        }
        if (this.verif_coll(objs, next_pos) === false) {
            this.y += speed;
            if (this.y > 500) {
                this.y = 500;
            }
        }
    }

    left(speed, objs) {
        let next_pos = {
            ip: this.ip,
            x: this.x - speed,
            y: this.y,
            w: this.w,
            h: this.h
        }
        if (this.verif_coll(objs, next_pos) === false) {
            this.x -= speed;
            if (this.x < 0) {
                this.x = 0;
            }
        }
    }

    right(speed, objs) {
        let next_pos = {
            ip: this.ip,
            x: this.x + speed,
            y: this.y,
            w: this.w,
            h: this.h
        }
        if (this.verif_coll(objs, next_pos) === false) {
            this.x += speed;
            if (this.x > 500) {
                this.x = 500;
            }
        }
    }

}

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
    users.push(new user(ip, Math.random() * 500, Math.random() * 500));
    socket.on('move', function(dir) {
        if (dir === 'up') {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].up(1, users);
                }
            }
        }
        if (dir === 'down')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].down(1, users);
                }
            }
        }
        if (dir === 'left')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].left(1, users);
                }
            }
        }
        if (dir === 'right')  {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].ip === ip) {
                    users[i].right(1, users);
                }
            }
        }
        io.emit('users', users);
    });

    socket.on('disconnect', function(socket) {
        users = deluser(users, ip);
    });
});

http.listen(3001, function() {
    console.log('listening on *:3000');
});