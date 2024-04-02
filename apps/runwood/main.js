import { vec2 } from './MathUtils.js';

class Character {
    constructor(name, type, position) {
        this.name = name;
        this.type = type;
        this.health = 100;
        this.level = 1;
        this.position = position;
    }

    set type(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }

    set position(position) {
        this._position = position;
    }

    get position() {
        return this._position;
    }
}

const CLASSES = {
    BOWMAN: {
        portrait : '🏹',
        name: 'Bowman',
        health: 100,
        attack: 10,
        defense: 5,
        speed: 10
    },
    MAGICIAN: {
        portrait : '🧙',
        name: 'Magician',
        health: 100,
        attack: 5,
        defense: 10,
        speed: 5
    },
    WARRIOR: {
        portrait : '⚔️',
        name: 'Warrior',
        health: 100,
        attack: 15,
        defense: 10,
        speed: 5
    }
};

class Controller {
    constructor(gameMap, player) {
        this.player = player;
        this.gameMap = gameMap;
        this.player.position = new vec2(0, 0);
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    this.move('up');
                    break;
                case 'ArrowDown':
                    this.move('down');
                    break;
                case 'ArrowLeft':
                    this.move('left');
                    break;
                case 'ArrowRight':
                    this.move('right');
                    break;
                    // Space key
                case ' ':
                    this.areaAttack();
                    break;
                default:
                    break;
            }
        });
    }

    move(direction) {
        this.gameMap.update(this.player.position)
        switch (direction) {
            case 'up':
                this.player.position.add(new vec2(-1, 0));
                break;
            case 'down':
                this.player.position.add(new vec2(1, 0));
                break;
            case 'left':
                this.player.position.add(new vec2(0, -1));
                break;
            case 'right':
                this.player.position.add(new vec2(0, 1));
                break;
            default:
                break;
        }
        let passable = this.gameMap.update(this.player.position, this.player.type.portrait);
        if (!passable) {
            switch (direction) {
                case 'up':
                    this.player.position.add(new vec2(1, 0));
                    break;
                case 'down':
                    this.player.position.add(new vec2(-1, 0));
                    break;
                case 'left':
                    this.player.position.add(new vec2(0, 1));
                    break;
                case 'right':
                    this.player.position.add(new vec2(0, -1));
                    break;
                default:
                    break;
            }
            this.gameMap.update(this.player.position, this.player.type.portrait);
        }
    }

    areaAttack() {
        const area = [
            new vec2(-1, 0),
            new vec2(1, 0),
            new vec2(0, -1),
            new vec2(0, 1)
        ];
        area.forEach((position) => {
            let impactedPosition = new vec2(this.player.position.x + position.x, this.player.position.y + position.y);
            this.gameMap.update(impactedPosition, '🔥');
        });
    }
}

class GameMap {
    constructor(size) {
        this.map = [];
        this.parent = document.getElementById('map');
        this.size = size;
        this.init();
    }

    init() {
        for (let i = 0; i < this.size.x; i++) {
            const row = document.createElement('tr');
            this.map.push([]);
            for (let j = 0; j < this.size.y; j++) {
                const cell = document.createElement('td');
                cell.innerHTML = '🌲';
                row.appendChild(cell);
                this.map[i].push({parent: cell, content: [cell.innerHTML]});
            }
            this.parent.appendChild(row);
        }
    }

    update(position, content) {
        if (position.x < 0 || position.x >= this.size.x || position.y < 0 || position.y >= this.size.y) {
            return false;
        }
        if (position && !content) {
            this.map[position.x][position.y].content.pop();
            let cellContent = this.map[position.x][position.y].content;
            this.map[position.x][position.y].parent.innerHTML = cellContent[cellContent.length - 1];
            return true;
        }
        if (position && content) {
            this.map[position.x][position.y].content.push(content);
            let cellContent = this.map[position.x][position.y].content;
            this.map[position.x][position.y].parent.innerHTML = cellContent[cellContent.length - 1];
            return true;
        }
        if (!position && !content) {
            for (let i = 0; i < this.size.x; i++) {
                for (let j = 0; j < this.size.y; j++) {
                    this.map[i][j].parent.innerHTML = this.map[i][j].content[this.map[i][j].content.length - 1];
                }
            }
            return true;
        }
    }
}



function main() {
    const player = new Character('Ymene', CLASSES.MAGICIAN, new vec2(0, 0));
    const gameMap = new GameMap(new vec2(20, 20));
    const controller = new Controller(gameMap, player);
    
    gameMap.update(player.position, player.type.portrait);
}

main();