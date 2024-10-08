const MAX_DISTANCE = 50;
const RUNNING_DISTANCE = 100;

let body = null;
let bloodLevel = 0;
let tinies = [];

Math.distance = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function convertLetters(letters) {
    const innerText = letters.innerText;
    letters.innerText = '';
    for (let i in innerText) {
        const e = document.createElement('span');
        e.innerText = innerText[i];
        letters.appendChild(e);
        e.style.setProperty('left', e.getBoundingClientRect().x + 'px');
        e.style.setProperty('top', e.getBoundingClientRect().y + 'px');
        e.classList.add('tiny');
    }
    const tinies = document.querySelectorAll('.tiny');
    tinies.forEach((tiny) => {
        tiny.classList.add('tiny_preserved')
    });

    return tinies;
}

function placeBlood(x, y) {
    const blood = document.createElement('span');
    blood.style.setProperty('left', x + 'px');
    blood.style.setProperty('top', y + 'px');
    blood.style.setProperty('font-size', Math.random() * 20 + 20 + 'px');
    blood.classList.add('blood');
    blood.innerText = '.';
    body.appendChild(blood);
}

function updateBloodPicture() {
    const bloodPicture = Math.min(6, Math.floor(bloodLevel / 10) + 1);
    document.body.style.setProperty('cursor', 'url("./images/cursor/' + bloodPicture + '.png"), auto');
}


document.addEventListener('DOMContentLoaded', function() {
    body = document.getElementsByTagName('body')[0];
    const letters = document.getElementById('letters');
    tinies = convertLetters(letters);
    tinies.forEach((tiny) => {
        tiny.addEventListener('mouseover', () => {
            bloodLevel += 1;
            updateBloodPicture();
            tiny.classList.add('tiny_dead');
        });
    });
});


const onMouseMove = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    bloodLevel = Math.max(0, bloodLevel - 0.2);
    updateBloodPicture();
    const bloodChance = Math.random() * 0.1 * bloodLevel;
    if (bloodChance > 0.4) {
        placeBlood(x, y);
    }
    tinies.forEach((tiny) => {
        const tinyX = tiny.getBoundingClientRect().x;
        const tinyY = tiny.getBoundingClientRect().y;
        const distance = Math.distance(tinyX, tinyY, x, y);
        if (tiny.classList.contains('tiny_moving')) { 
            if (distance > RUNNING_DISTANCE) {
                tiny.classList.remove('tiny_moving');
                const captions = tiny.querySelectorAll('span');
                captions.forEach((caption) => {
                    caption.style.setProperty('opacity', '0'); 
                });
            }
        } else if (!tiny.classList.contains('tiny_dead')) {
            if (distance < MAX_DISTANCE) {
                const angle = Math.atan2(tinyY - y, tinyX - x);
                const newX = tinyX + Math.cos(angle) * 100;
                const newY = tinyY + Math.sin(angle) * 100;
                // check if new position is inside the window
                if (newX < 0 || newX > window.innerWidth || newY < 0 || newY > window.innerHeight) {
                    // create another angle
                    const newAngle = angle + Math.PI;
                    const newX = tinyX + Math.cos(newAngle) * 100;
                    const newY = tinyY + Math.sin(newAngle) * 100;
                    tiny.style.setProperty('left', newX + 'px');
                    tiny.style.setProperty('top', newY + 'px');
                } else {
                    tiny.style.setProperty('left', newX + 'px');
                    tiny.style.setProperty('top', newY + 'px');
                    tiny.classList.add('tiny_moving');
                }
            }
        }

    });
};

document.addEventListener('mousemove', onMouseMove);

setInterval(() => {
    tinies.forEach((tiny) => {
        if (tiny.classList.contains('tiny_moving')) {
            // add rotation between 0 and 40 degrees
            const rotation = Math.random() * 40;
            tiny.style.setProperty('transform', `rotate(${rotation}deg)`);
            const emojis = ['😱', '😨', '😰'];
            const caption = document.createElement('span');
            caption.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            caption.classList.add('tiny__caption');
            tiny.appendChild(caption);
        }
    });
}, 1000);