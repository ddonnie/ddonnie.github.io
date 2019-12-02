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

    constructor(x, y, id) {
        if (x == undefined) {
            x = parseInt(Math.random() * (window.innerWidth - 200));
        }
        if (y == undefined) {
            y = parseInt(Math.random() * (window.innerHeight - 200));
        }
        this.id = this.constructor.name + '_' + id;
        this.class = this.constructor.name;
        this.position = new Point2D(x, y);
        this.objectRect;
    }

    draw() {
        let wrapper = document.createElement('div');
        document.getElementById("drawer").appendChild(wrapper);
        wrapper.id = this.id;
        wrapper.className = this.class;
        wrapper.style.position = 'absolute';
        wrapper.style.left = this.position.x;
        wrapper.style.top = this.position.y;

        let image = document.createElement('img');
        document.getElementById(wrapper.id).appendChild(image);
        image.src = this.constructor.name + '.png';

        this.objectRect = wrapper;
    }

    animate() {

    }
}

class Worker extends Object {
    constructor(x, y, id) {
        super(x, y, id);
        this.direction = new Vector2D(0, 0);
        this.speed = 1;
        this.load;
    }

    animate() {
        if (this.load == undefined) {
            this.findApple();
        } else {
            this.carryApple();
        }
    }

    walk() {
        this.position.x = this.position.x + this.direction.x * this.speed;
        this.position.y = this.position.y  + this.direction.y * this.speed;

        this.objectRect.style.left = this.position.x;
        this.objectRect.style.top = this.position.y;
    }

    findApple() {
        let closestApple;
        let closestAppleDistance;
        let apples = window.appleFactory.apples;

        for (let i = 0; i < apples.length; i++) {
            if (apples[i] instanceof Apple &&
                apples[i].isAtFire == false &&
                apples[i].isLoaded == false &&
                apples[i].isTargetedBy(this) || apples[i].targetOf == undefined) {
                let distance = this.position.distanceTo(apples[i].position);
                if (closestAppleDistance == undefined) {
                    closestAppleDistance = distance;
                    closestApple = apples[i];
                } else if (distance < closestAppleDistance) {
                    closestAppleDistance = distance;
                    closestApple = apples[i];
                }
                if (distance < closestApple.objectRect.clientWidth + this.objectRect.clientWidth) {
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
        this.load.isAtFire = true;
        document.getElementById(this.load.objectRect.id).remove();
        this.load = null;
        this.findApple();
    }
    carryApple() {
        this.load.position.x = this.position.x;
        this.load.position.y = this.position.y + 30;

        this.load.objectRect.style.left = this.load.position.x;
        this.load.objectRect.style.top = this.load.position.y;

        this.returnToFire();
    }
    returnToFire() {
        let fire = window.fire;
        let x = fire.position.x - this.position.x;
        let y = fire.position.y - this.position.y;
        let direction = new Vector2D(x, y);
        direction = direction.normalized();
        this.direction.x = direction.x;
        this.direction.y = direction.y;

        this.walk();

        let distanceToFire = this.position.distanceTo(fire.position);
        if (distanceToFire < fire.objectRect.offsetWidth) {
            this.giveApple();
            fire.grow();
        }
    }
}

class Fire extends Object {
    constructor(x, y) {
        super(x, y, 0);
    }
    grow() {
        this.objectRect.children[0].width += 5;
    }
    draw() {
        let wrapper = document.createElement('div');
        document.getElementById("drawer").appendChild(wrapper);
        wrapper.id = this.id;
        wrapper.className = this.class;
        wrapper.style.position = 'absolute';
        wrapper.style.left = this.position.x;
        wrapper.style.top = this.position.y;

        let image = document.createElement('img');
        document.getElementById(wrapper.id).appendChild(image);
        image.src = this.constructor.name + '.gif';
        image.width = 40;

        this.objectRect = wrapper;
    }
}

class Apple extends Object {
    constructor(x, y, id) {
        super(x, y, id);
        this.isAtFire= false;
        this.isLoaded = false;
        this.targetOf;
    }

    isTargetedBy(worker) {
        if (this.targetOf == worker) {
            return true;
        } else {
            return false;
        }
    }
}

class workerFactory {
    constructor() {
        this.workerCounter = 0;
        this.workers = [];
    }
    createWorker(x, y) {
        let worker = new Worker(x, y, this.workerCounter++);
        this.workers.push(worker);
        return worker;
    }
}

class appleFactory {
    constructor() {
        this.appleCounter = 0;
        this.apples = [];
    }
    createApple(x, y) {
        let apple = new Apple(x, y, this.appleCounter++);
        this.apples.push(apple);
        return apple;
    }
}

function initObjects() {
    window.workerFactory = new workerFactory();
    window.appleFactory = new appleFactory();
    window.fire = new Fire(200,200);

    window.workerFactory.createWorker();
    window.workerFactory.createWorker();
    window.workerFactory.createWorker();
}

function drawObjects() {
    window.workerFactory.workers.forEach(function (worker) {
        worker.draw();
    });
    window.fire.draw();
}

function animateObjects() {
    window.appleFactory.apples = window.appleFactory.apples.filter(function (value, index, arr) {
        return value.isAtFire != true;
    });

    window.workerFactory.workers.forEach(function (worker) {
        worker.animate();
    });
}


addEventListener('click', function (e) {
    window.appleFactory.createApple(e.clientX, e.clientY).draw();
});


initObjects();
drawObjects();

while (true) {
    setInterval(function () {
        animateObjects();
    }, 0);
    break;
}