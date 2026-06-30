import { CanvasRenderer } from '../views/CanvasRenderer.js';

export class CanvasController {
    constructor(project, canvasElement) {
        this.project = project;
        this.canvasElement = canvasElement;
        this.dragData = null;
        this.moveData = null;

        // Inyección de dependencia del renderizador
        this.renderer = new CanvasRenderer(canvasElement);

        // Vincular eventos
        this._bindEvents();
    }

    _bindEvents() {
        this.canvasElement.addEventListener('mousedown', (e) => {
            const target = e.target.closest('.componente-canvas');
            if (!target) return;
            const id = parseInt(target.dataset.id, 10);
            this.iniciarArrastreDesdeId(e, id);
        });

        this.canvasElement.addEventListener('dblclick', (e) => {
            const target = e.target.closest('.componente-canvas');
            if (!target) return;
            const id = parseInt(target.dataset.id, 10);
            const comp = this.project.getComponent(id);

            if (comp) {
                const nuevoTexto = prompt('Editar texto del componente:', comp.text);
                if (nuevoTexto !== null) {
                    this.project.updateComponent(id, { text: nuevoTexto });
                    this.renderer.render(this.project.components);
                }
            }
        });
    }

    _onDrop() {
        this.moveData = null;
        document.removeEventListener('mousemove', this._onMouseMoveRef);
        document.removeEventListener('mouseup', this._onMouseUpRef);
    }

    _onMove(e) {
        if (!this.moveData) return;
        const rect = this.canvasElement.getBoundingClientRect();
        const comp = this.project.getComponent(this.moveData.id);
        if (!comp) return;

        let x = e.clientX - rect.left - this.moveData.offsetX;
        let y = e.clientY - rect.top - this.moveData.offsetY;
        x = Math.max(0, Math.min(x, this.canvasElement.clientWidth - comp.width));
        y = Math.max(0, Math.min(y, this.canvasElement.clientHeight - comp.height));

        this.project.updateComponent(comp.id, { x, y });
        this.renderer.render(this.project.components); // Redibujar todo
    }

    // Método para agregar un componente desde el Toolbar
    addComponentFromToolbar(type, clientX, clientY) {
        const rect = this.canvasElement.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left - 50, this.canvasElement.clientWidth - 100));
        const y = Math.max(0, Math.min(clientY - rect.top - 20, this.canvasElement.clientHeight - 40));
        const comp = this.project.addComponent(type, x, y);
        this.renderer.render(this.project.components);
        return comp;
    }

    iniciarArrastreDesdeId(e, id) {
        const comp = this.project.getComponent(id);
        if (!comp) return;

        const rect = this.canvasElement.getBoundingClientRect();
        this.moveData = {
            id,
            offsetX: e.clientX - rect.left - comp.x,
            offsetY: e.clientY - rect.top - comp.y
        };

        this._onMouseMoveRef = this._onMove.bind(this);
        this._onMouseUpRef = this._onDrop.bind(this);

        document.addEventListener('mousemove', this._onMouseMoveRef);
        document.addEventListener('mouseup', this._onMouseUpRef);
    }
}