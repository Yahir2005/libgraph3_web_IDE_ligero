export class CanvasRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
    }

    render(components) {
        this.canvas.innerHTML = '';

        components.forEach(comp => {
            const div = document.createElement('div');
            div.className = 'componente-canvas';
            div.dataset.id = comp.id;

            if (comp.type === 'rectangulo') div.classList.add('rectangulo');
            if (comp.type === 'texto') div.classList.add('texto');
            if (comp.type === 'campo') div.classList.add('campo');

            div.textContent = comp.text;
            div.style.left = `${comp.x}px`;
            div.style.top = `${comp.y}px`;
            div.style.width = `${comp.width}px`;
            div.style.height = `${comp.height}px`;

            // Mapeo cromático de libgraph hacia CSS para previsualización fidedigna
            const hexadecimales = {
                'LIGHTBLUE': '#3498db',
                'RED': '#e74c3c',
                'YELLOW': '#f1c40f',
                'GREEN': '#2ecc71',
                'WHITE': '#ffffff',
                'BLACK': '#1e1e1e',
                'BLUE': '#2980b9'
            };

            const colorHex = hexadecimales[comp.color] || '#3498db';

            if (comp.type === 'boton') {
                div.style.backgroundColor = colorHex;
                div.style.color = comp.color === 'WHITE' ? '#000' : '#fff';
            } else if (comp.type === 'rectangulo') {
                div.style.borderColor = colorHex;
            } else if (comp.type === 'campo') {
                div.style.backgroundColor = colorHex;
                div.style.color = '#000';
                div.style.border = '2px inset #3c3c3c';
                div.style.textAlign = 'left';
            } else if (comp.type === 'texto') {
                div.style.color = colorHex;
                div.style.fontSize = `${13 + (comp.fontSize - 1) * 4}px`;
            }

            // Inserción de la manija de cambio de tamaño interactivo por mouse (excepto texto puro)
            if (comp.type !== 'texto') {
                const handle = document.createElement('div');
                handle.className = 'resizer-handle';
                div.appendChild(handle);
            }

            this.canvas.appendChild(div);
        });
    }

    limpiar() {
        this.canvas.innerHTML = '';
    }
}