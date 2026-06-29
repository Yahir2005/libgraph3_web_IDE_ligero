const canvas = document.getElementById('canvas');

let moving = false;
let image = null;
let offsetX = 0;
let offsetY = 0;

// Componentes del toolbar
document.getElementById('bottom').addEventListener('mousedown', crearCopia);
document.getElementById('text').addEventListener('mousedown', crearCopia);
document.getElementById('rectangle').addEventListener('mousedown', crearCopia);

function crearCopia(e) {
    e.preventDefault();

    const copia = document.createElement('div');
    copia.className = 'componente-canvas';
    copia.textContent = this.textContent;

    canvas.appendChild(copia);

    const rect = canvas.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, canvas.clientWidth - copia.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - copia.offsetHeight));

    copia.style.left = x + 'px';
    copia.style.top = y + 'px';

    image = copia;
    moving = true;

    offsetX = copia.offsetWidth / 2;
    offsetY = copia.offsetHeight / 2;

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', soltar);
}

function moverExistente(e) {
    e.stopPropagation();
    e.preventDefault();

    image = this;
    moving = true;

    const rect = image.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', soltar);
}

function move(e) {
    if (!moving || !image) return;

    const rect = canvas.getBoundingClientRect();

    let x = e.clientX - rect.left - offsetX;
    let y = e.clientY - rect.top - offsetY;

    x = Math.max(0, Math.min(x, canvas.clientWidth - image.offsetWidth));
    y = Math.max(0, Math.min(y, canvas.clientHeight - image.offsetHeight));

    image.style.left = x + 'px';
    image.style.top = y + 'px';
}

function soltar() {
    if (image) {
        image.removeEventListener('mousedown', moverExistente);
        image.addEventListener('mousedown', moverExistente);
    }

    moving = false;
    image = null;

    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', soltar);
}