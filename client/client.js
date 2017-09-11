        var socket = io();
        socket.emit('test', 'test');

        document.body.addEventListener("keydown", function(e) {
            console.log(e.key);
            socket.emit('move', 'up');
        });
        socket.on('users', function(users) {
            document.querySelector('#messages').innerHTML = "";
            for (let u of users) {
                document.querySelector('#messages').innerHTML +=
                    '<li style="top=' + u.y + '; left=' + u.x + '">' + u.ip + '</li>';
            }
        });