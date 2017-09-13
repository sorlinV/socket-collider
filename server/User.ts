export class User {
    type:string;
    ip:string;
    x:number;
    y:number;
    w:number;
    h:number;
    constructor(ip:string, x:number, y:number, type:string) {
        this.type = type;
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

    verif_coll(colls, next_pos) {
        let Object_coll = new Array();
        for (let i = 0; i < colls.length; i++) {
            if (this.collision(next_pos, colls[i]) == true && next_pos.ip !== colls[i].ip) {
                Object_coll.push(colls[i]);
            }
        }
        if (Object_coll !== undefined && Object_coll[0] !== undefined) {
            return Object_coll;
        }
        return false;
    }

    next_pos(speed, dir) {
        if (dir === "up") {
            return new Object(this.ip, this.x, this.y - speed, this.type);
        } else if (dir === "down") {
            return new Object(this.ip, this.x, this.y + speed, this.type);
        } else if (dir === "left") {
            return new Object(this.ip, this.x - speed, this.y, this.type);
        } else if (dir === "right") {
            return new Object(this.ip, this.x + speed, this.y, this.type);
        }
    }

    up(speed, colls) {
        let objs = this.verif_coll(colls, this.next_pos(speed, 'up'));
        if (objs === false) {
            this.y -= speed;
        } else {}
    }

    down(speed, colls) {
        let objs = this.verif_coll(colls, this.next_pos(speed, 'down'));
        if (objs === false) {
            this.y += speed;
        } else {}
    }

    left(speed, colls) {
        let objs = this.verif_coll(colls, this.next_pos(speed, 'left'));
        if (objs === false) {
            this.x -= speed;
        } else {}
    }

    right(speed, colls) {
        let objs = this.verif_coll(colls, this.next_pos(speed, 'right'));
        if (objs === false) {
            this.x += speed;
        } else {}
    }
}