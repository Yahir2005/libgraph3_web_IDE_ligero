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

            // Renderizado base de texto para componentes que sí lo llevan
            if (!['rectangulo', 'circulo', 'linea', 'pixel'].includes(comp.type)) {
                div.textContent = comp.text;
            } else {
                div.textContent = ''; // Limpiar texto de primitivas
            }

            if (comp.type === 'boton') {
                div.style.backgroundColor = colorHex;
                div.style.color = comp.color === 'WHITE' ? '#000' : '#fff';
            } else if (comp.type === 'rectangulo') {
                div.style.borderColor = colorHex;
                div.style.boxShadow = 'none';
            } else if (comp.type === 'campo') {
                div.style.backgroundColor = colorHex;
                div.style.color = '#000';
                div.style.border = '2px inset #3c3c3c';
                div.style.textAlign = 'left';
            } else if (comp.type === 'texto') {
                div.style.color = colorHex;
                div.style.fontSize = `${13 + (comp.fontSize - 1) * 4}px`;
            } else if (comp.type === 'circulo') {
                div.style.borderRadius = '50%';
                div.style.border = `2px solid ${colorHex}`;
                div.style.backgroundColor = 'transparent';
                div.style.boxShadow = 'none';
            } else if (comp.type === 'pixel') {
                div.style.backgroundColor = colorHex;
                div.style.minWidth = '2px'; // Hacerlo pequeño pero visible
                div.style.boxShadow = 'none';
                div.style.border = 'none';
            } else if (comp.type === 'linea') {
                div.style.backgroundColor = 'transparent';
                div.style.boxShadow = 'none';
                div.style.border = 'none';
                // Usamos SVG inyectado para lograr la línea diagonal perfecta de x1,y1 a x2,y2
                div.innerHTML = `<svg width="100%" height="100%" style="position:absolute; top:0; left:0; pointer-events:none;">
                                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="${colorHex}" stroke-width="2"/>
                                 </svg>`;
            }

            // Inserción de la manija de cambio de tamaño interactivo por mouse (excepto texto puro y pixel)
            if (comp.type !== 'texto' && comp.type !== 'pixel') {
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