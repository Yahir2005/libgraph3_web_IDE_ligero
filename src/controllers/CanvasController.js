import { CanvasRenderer } from '../views/CanvasRenderer.js';

export class CanvasController {
    constructor(project, canvasElement) {
        this.project = project;
        this.canvasElement = canvasElement;
        this.moveData = null;
        this.resizeData = null;

        this.renderer = new CanvasRenderer(canvasElement);
        this._bindEvents();
        this._initMenuPropiedades();
    }

    _bindEvents() {
        this.canvasElement.addEventListener('mousedown', (e) => {
            const targetComp = e.target.closest('.componente-canvas');
            if (!targetComp) {
                this.ocultarMenu();
                return;
            }

            const id = parseInt(targetComp.dataset.id, 10);
            const comp = this.project.getComponent(id);
            if (!comp) return;

            // CASO A: Redimensionamiento con el mouse (Manija inferior derecha)
            if (e.target.classList.contains('resizer-handle')) {
                e.stopPropagation();
                e.preventDefault();
                this.resizeData = {
                    id,
                    startWidth: comp.width,
                    startHeight: comp.height,
                    startX: e.clientX,
                    startY: e.clientY
                };
                this._onMouseResizeRef = this._onResize.bind(this);
                this._onMouseUpRef = this._onDrop.bind(this);
                document.addEventListener('mousemove', this._onMouseResizeRef);
                document.addEventListener('mouseup', this._onMouseUpRef);
                return;
            }

            // CASO B: Clic Izquierdo Normal (Mover + Abrir menú flotante de opciones)
            this.iniciarArrastreDesdeId(e, id);
            this.mostrarMenuPropiedades(e, comp);
        });
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

        const el = this.canvasElement.querySelector(`[data-id="${comp.id}"]`);
        if (el) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        }
    }

    _onResize(e) {
        if (!this.resizeData) return;
        const comp = this.project.getComponent(this.resizeData.id);
        if (!comp) return;

        const deltaX = e.clientX - this.resizeData.startX;
        const deltaY = e.clientY - this.resizeData.startY;

        let nuevoAncho = Math.max(40, this.resizeData.startWidth + deltaX);
        let nuevoAlto = Math.max(24, this.resizeData.startHeight + deltaY);

        if (comp.x + nuevoAncho > this.canvasElement.clientWidth) {
            nuevoAncho = this.canvasElement.clientWidth - comp.x;
        }
        if (comp.y + nuevoAlto > this.canvasElement.clientHeight) {
            nuevoAlto = this.canvasElement.clientHeight - comp.y;
        }

        this.project.updateComponent(comp.id, { width: nuevoAncho, height: nuevoAlto });

        const el = this.canvasElement.querySelector(`[data-id="${comp.id}"]`);
        if (el) {
            el.style.width = `${nuevoAncho}px`;
            el.style.height = `${nuevoAlto}px`;
        }
    }

    _onDrop() {
        this.moveData = null;
        this.resizeData = null;
        document.removeEventListener('mousemove', this._onMouseMoveRef);
        document.removeEventListener('mousemove', this._onMouseResizeRef);
        document.removeEventListener('mouseup', this._onMouseUpRef);
    }

    addComponentFromToolbar(type, clientX, clientY) {
        const rect = this.canvasElement.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left - 50, this.canvasElement.clientWidth - 100));
        const y = Math.max(0, Math.min(clientY - rect.top - 20, this.canvasElement.clientHeight - 40));

        const width = type === 'texto' ? 80 : type === 'campo' ? 140 : 100;
        const height = type === 'texto' ? 24 : type === 'campo' ? 38 : 40;

        const comp = this.project.addComponent(type, x, y);
        this.project.updateComponent(comp.id, { width, height });

        this.renderer.render(this.project.components);
        return comp;
    }

    // --- INTEGRACIÓN DEL PANEL DE PROPIEDADES INMEDIATO ---
    _initMenuPropiedades() {
        this.menu = document.getElementById('menu-propiedades');
        this.inputTexto = document.getElementById('prop-texto');
        this.selectColor = document.getElementById('prop-color');
        this.inputSize = document.getElementById('prop-size');
        this.textareaCodigo = document.getElementById('prop-codigo');
        this.inputVariable = document.getElementById('prop-variable');
        this.btnGuardar = document.getElementById('prop-guardar');
        this.compActualId = null;

        this.btnGuardar.addEventListener('click', () => {
            if (this.compActualId === null) return;

            const cambios = {
                text: this.inputTexto.value,
                color: this.selectColor.value,
                fontSize: parseInt(this.inputSize.value, 10),
                command: this.textareaCodigo.value,
                varName: this.inputVariable.value
            };

            this.project.updateComponent(this.compActualId, cambios);
            this.renderer.render(this.project.components);
            this.ocultarMenu();
        });
    }

    mostrarMenuPropiedades(e, comp) {
        this.compActualId = comp.id;
        this.inputTexto.value = comp.text || '';
        this.selectColor.value = comp.color || 'BLACK';
        this.inputSize.value = comp.fontSize || 1;
        this.textareaCodigo.value = comp.command || '';
        this.inputVariable.value = comp.varName || '';

        // Condicionales de interfaz según el tipo de componente
        document.getElementById('prop-codigo-container').style.display = comp.type === 'boton' ? 'block' : 'none';
        document.getElementById('prop-variable-container').style.display = comp.type === 'campo' ? 'block' : 'none';
        document.getElementById('prop-size-container').style.display = comp.type === 'texto' ? 'block' : 'none';

        this.menu.style.display = 'block';
        this.menu.style.left = `${e.clientX + 15}px`;
        this.menu.style.top = `${e.clientY + 15}px`;
    }

    ocultarMenu() {
        if (this.menu) this.menu.style.display = 'none';
    }
}