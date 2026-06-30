export class Component {
    constructor({ id, type, x, y, width, height, text, command, varName, color, fontSize }) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text !== undefined ? text : this.getDefaultText();
        this.command = command || '';
        this.varName = varName || '';
        this.color = color || this.getDefaultColor();
        this.fontSize = fontSize || 1;
    }

    getDefaultText() {
        const map = { boton: 'Botón', texto: 'Texto', rectangulo: 'Rect', campo: 'Campo', circulo: '', linea: '', pixel: '' };
        return map[this.type] !== undefined ? map[this.type] : 'Componente';
    }

    getDefaultColor() {
        const map = { boton: 'LIGHTBLUE', texto: 'BLACK', rectangulo: 'RED', campo: 'WHITE', circulo: 'BLUE', linea: 'BLACK', pixel: 'BLACK' };
        return map[this.type] || 'BLACK';
    }
}