class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceTo(point) {
        return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2);
    }
}
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    normalized() {
        let normalizedVector = new Vector2D();
        normalizedVector.x = this.x / this.length;
        normalizedVector.y = this.y / this.length;
        return normalizedVector;
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);;
    }
}

class Object {

    constructor(x, y, r = 5) {
        if (x == undefined) {
            x = parseInt(Math.random() * 200 + 100);
        }
        if (y == undefined) {
            y = parseInt(Math.random() * 200 + 100);
        }
        this.position = new Point2D(x, y);
        this.radius = r;
        this.color = "#0095DD";
    }

    draw() {
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, Math.PI / 4, 0, 3 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    update() { }

}

class Worker extends Object {
    constructor(x, y) {
        super(x, y, 10);
        this.direction = new Vector2D(0, 0);
        this.speed = 1;
        this.color = "#778beb";
        this.load;
    }

    draw() {
        let img = new Image;
        img.src = 'worker.png';
        ctx.drawImage(img, this.position.x, this.position.y);
    }

    update() {
        if (this.load == undefined) {
            this.findApple();
        } else {
            this.carryApple();
        }
    }

    walk() {
        this.position.x = this.position.x + this.direction.x * this.speed;
        this.position.y = this.position.y + this.direction.y * this.speed;
    }

    findApple() {
        let closestApple;
        let closestAppleDistance;

        for (let i = 0; i < window.objects['Apples'].length; i++) {
            if (window.objects['Apples'][i] instanceof Apple &&
                window.objects['Apples'][i].isAtBase == false &&
                window.objects['Apples'][i].isLoaded == false &&
                (window.objects['Apples'][i].isTargetedBy(this) || window.objects['Apples'][i].targetOf == undefined)) {
                let distance = this.position.distanceTo(window.objects['Apples'][i].position);
                if (closestAppleDistance == undefined) {
                    closestAppleDistance = distance;
                    closestApple = window.objects['Apples'][i];
                } else if (distance < closestAppleDistance) {
                    closestAppleDistance = distance;
                    closestApple = window.objects['Apples'][i];
                }
                if (distance < closestApple.radius + this.radius) {
                    this.takeApple(closestApple);
                }
            }
        }
        if (closestApple != undefined) {
            let x = closestApple.position.x - this.position.x;
            let y = closestApple.position.y - this.position.y;
            let direction = new Vector2D(x, y);
            direction = direction.normalized();
            this.direction.x = direction.x;
            this.direction.y = direction.y;
            closestApple.targetOf = this;
            this.walk();
        }
    }
    takeApple(apple) {
        this.load = apple;
        this.load.isLoaded = true;
    }
    giveApple() {
        this.load.isLoaded = false;
        this.load.isAtBase = true;
        this.load.position.x = window.objects['Base'].position.x + Math.round(Math.random()) * window.objects['Base'].radius - 20;
        this.load.position.y = window.objects['Base'].position.y + Math.round(Math.random()) * window.objects['Base'].radius - 20;
        this.load = null;
        this.findApple();
    }
    carryApple() {
        this.load.position.x = this.position.x;
        this.load.position.y = this.position.y + 30;
        this.returnToBase();
    }
    returnToBase() {
        let base = window.objects['Base'];
        let x = base.position.x - this.position.x;
        let y = base.position.y - this.position.y;
        let direction = new Vector2D(x, y);
        direction = direction.normalized();
        this.direction.x = direction.x;
        this.direction.y = direction.y;

        this.walk();

        let distanceToBase = this.position.distanceTo(base.position);
        if (distanceToBase < base.radius) {
            this.giveApple();
            base.grow();
        }
    }
}

class Base extends Object {
    constructor(x, y) {
        super(x, y, 20);
        this.color = "#596275";
    }
    grow() {
        this.radius++;
    }
}

class Apple extends Object {
    constructor(x, y) {
        super(x, y, 5);
        this.color = "#e15f41";
        this.isAtBase = false;
        this.isLoaded = false;
        this.targetOf;
    }

    draw() {
        let img = new Image;
        img.src = 'apple.png';
        ctx.drawImage(img, this.position.x, this.position.y);
    }

    isTargetedBy(worker) {
        if (this.targetOf == worker) {
            return true;
        } else {
            return false;
        }
    }
}

function initCanvas() {
    window.canvas = document.getElementById('drawer');
    window.ctx = canvas.getContext('2d');
}

function initObjects() {
    let worker = new Worker();
    let worker2 = new Worker();
    let worker3 = new Worker();
    let base = new Base();

    window.objects = [];
    window.objects['Apples'] = [];
    window.objects['Workers'] = [];
    window.objects['Base'] = base;
    window.objects['Workers'].push(worker);
    window.objects['Workers'].push(worker2);
    window.objects['Workers'].push(worker3);

}

addEventListener('click', function (e) {
    let rect = window.canvas.getBoundingClientRect();
    let apple = new Apple(e.clientX, e.clientY);
    window.objects['Apples'].push(apple);
});

function update() {
    window.ctx.canvas.width = window.innerWidth;
    window.ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let backgroundImage = new Image();
    backgroundImage.src = 'https://i.pinimg.com/originals/5b/31/d8/5b31d8709b8b12767cb1f1edfd214899.jpg';
    var ptrn = window.ctx.createPattern(backgroundImage, 'repeat');
    window.ctx.fillStyle = ptrn;
    window.ctx.fillRect(0, 0, window.canvas.width, window.canvas.height);

    window.objects['Base'].draw();
    window.objects['Workers'].forEach(function (obj) {
        obj.update();
        obj.draw();
    });
    window.objects['Apples'] = window.objects['Apples'].filter(function (value, index, arr) {
        return value.isAtBase != true;
    });
    window.objects['Apples'].forEach(function (obj) {
        obj.draw();
    });

}

//main loop
initCanvas();
initObjects();

while (true) {
    setInterval(function () {
        update();
    }, 0);
    break;
}
