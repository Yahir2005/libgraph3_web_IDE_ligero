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
            if (!targetComp) { this.ocultarMenu(); return; }

            const id = parseInt(targetComp.dataset.id, 10);
            const comp = this.project.getComponent(id);
            if (!comp) return;

            if (e.target.classList.contains('resizer-handle')) {
                e.stopPropagation(); e.preventDefault();
                this.resizeData = { id, startWidth: comp.width, startHeight: comp.height, startX: e.clientX, startY: e.clientY };
                this._onMouseResizeRef = this._onResize.bind(this);
                this._onMouseUpRef = this._onDrop.bind(this);
                document.addEventListener('mousemove', this._onMouseResizeRef);
                document.addEventListener('mouseup', this._onMouseUpRef);
                return;
            }

            this.iniciarArrastreDesdeId(e, id, comp);
            this.mostrarMenuPropiedades(e, comp);
        });
    }

    iniciarArrastreDesdeToolbar(e, tipo) {
        const rect = this.canvasElement.getBoundingClientRect();
        let width = 100, height = 40;
        if (tipo === 'texto') { width = 80; height = 24; }
        else if (tipo === 'campo') { width = 140; height = 38; }
        else if (tipo === 'circulo') { width = 60; height = 60; }
        else if (tipo === 'linea') { width = 80; height = 80; }
        else if (tipo === 'pixel') { width = 10; height = 10; }

        let x = e.clientX - rect.left - (width / 2);
        let y = e.clientY - rect.top - (height / 2);

        const comp = this.project.addComponent(tipo, x, y);
        this.project.updateComponent(comp.id, { width, height });
        this.renderer.render(this.project.components);

        this.moveData = { id: comp.id, offsetX: width / 2, offsetY: height / 2 };
        this._onMouseMoveRef = this._onMove.bind(this);
        this._onMouseUpRef = this._onDrop.bind(this);
        document.addEventListener('mousemove', this._onMouseMoveRef);
        document.addEventListener('mouseup', this._onMouseUpRef);
    }

    iniciarArrastreDesdeId(e, id, comp) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.moveData = { id, offsetX: e.clientX - rect.left - comp.x, offsetY: e.clientY - rect.top - comp.y };
        this._onMouseMoveRef = this._onMove.bind(this);
        this._onMouseUpRef = this._onDrop.bind(this);
        document.addEventListener('mousemove', this._onMouseMoveRef);
        document.addEventListener('mouseup', this._onMouseUpRef);
    }

    _onMove(e) {
        if (!this.moveData) return;
        const rect = this.canvasElement.getBoundingClientRect();
        const comp = this.project.getComponent(this.moveData.id);

        let x = e.clientX - rect.left - this.moveData.offsetX;
        let y = e.clientY - rect.top - this.moveData.offsetY;
        x = Math.max(0, Math.min(x, this.canvasElement.clientWidth - comp.width));
        y = Math.max(0, Math.min(y, this.canvasElement.clientHeight - comp.height));

        this.project.updateComponent(comp.id, { x, y });
        const el = this.canvasElement.querySelector(`[data-id="${comp.id}"]`);
        if (el) { el.style.left = `${x}px`; el.style.top = `${y}px`; }
    }

    _onResize(e) {
        if (!this.resizeData) return;
        const comp = this.project.getComponent(this.resizeData.id);
        const deltaX = e.clientX - this.resizeData.startX;
        const deltaY = e.clientY - this.resizeData.startY;

        let nuevoAncho = Math.max(40, this.resizeData.startWidth + deltaX);
        let nuevoAlto = Math.max(24, this.resizeData.startHeight + deltaY);
        if (comp.x + nuevoAncho > this.canvasElement.clientWidth) nuevoAncho = this.canvasElement.clientWidth - comp.x;
        if (comp.y + nuevoAlto > this.canvasElement.clientHeight) nuevoAlto = this.canvasElement.clientHeight - comp.y;

        this.project.updateComponent(comp.id, { width: nuevoAncho, height: nuevoAlto });
        const el = this.canvasElement.querySelector(`[data-id="${comp.id}"]`);
        if (el) { el.style.width = `${nuevoAncho}px`; el.style.height = `${nuevoAlto}px`; }
    }

    _onDrop() {
        this.moveData = null; this.resizeData = null;
        document.removeEventListener('mousemove', this._onMouseMoveRef);
        document.removeEventListener('mousemove', this._onMouseResizeRef);
        document.removeEventListener('mouseup', this._onMouseUpRef);
    }

    _initMenuPropiedades() {
        this.menu = document.getElementById('menu-propiedades');
        this.inputTexto = document.getElementById('prop-texto');
        this.selectColor = document.getElementById('prop-color');
        this.inputSize = document.getElementById('prop-size');
        this.textareaCodigo = document.getElementById('prop-codigo');
        this.inputVariable = document.getElementById('prop-variable');

        document.getElementById('prop-guardar').addEventListener('click', () => {
            if (this.compActualId === null) return;
            this.project.updateComponent(this.compActualId, {
                text: this.inputTexto.value, color: this.selectColor.value,
                fontSize: parseInt(this.inputSize.value, 10), command: this.textareaCodigo.value, varName: this.inputVariable.value
            });
            this.renderer.render(this.project.components);
            this.ocultarMenu();
        });
    }

    mostrarMenuPropiedades(e, comp) {
        this.compActualId = comp.id;
        this.inputTexto.value = comp.text || ''; this.selectColor.value = comp.color || 'BLACK';
        this.inputSize.value = comp.fontSize || 1; this.textareaCodigo.value = comp.command || '';
        this.inputVariable.value = comp.varName || '';

        const esGeometrico = ['rectangulo', 'circulo', 'linea', 'pixel'].includes(comp.type);
        document.getElementById('label-texto').style.display = esGeometrico ? 'none' : 'block';
        this.inputTexto.style.display = esGeometrico ? 'none' : 'block';
        document.getElementById('prop-codigo-container').style.display = comp.type === 'boton' ? 'block' : 'none';
        document.getElementById('prop-variable-container').style.display = comp.type === 'campo' ? 'block' : 'none';
        document.getElementById('prop-size-container').style.display = comp.type === 'texto' ? 'block' : 'none';

        this.menu.style.display = 'block';
        this.menu.style.left = `${e.clientX + 15}px`;
        this.menu.style.top = `${e.clientY + 15}px`;
    }
    ocultarMenu() { if (this.menu) this.menu.style.display = 'none'; }
}