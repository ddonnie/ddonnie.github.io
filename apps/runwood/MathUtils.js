class vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    mul(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
    }

    div(vec) {
        this.x /= vec.x;
        this.y /= vec.y;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(value) {
        const factor = value / this.length;
        this.x *= factor;
        this.y *= factor;
    }

    normalize() {
        this.length = 1;
    }

    get normalized() {
        const length = this.length;
        return new vec2(this.x / length, this.y / length);
    }

    static get zero() {
        return new vec2(0, 0);
    }

    static get one() {
        return new vec2(1, 1);
    }

}

export { vec2 };