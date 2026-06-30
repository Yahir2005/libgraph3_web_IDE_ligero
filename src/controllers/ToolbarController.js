export class ToolbarController {
    constructor(toolbarElement, canvasController) {
        this.toolbar = toolbarElement;
        this.canvasController = canvasController;
        this._bindEvents();
    }

    _bindEvents() {
        this.toolbar.querySelectorAll('.herramienta').forEach(el => {
            el.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const tipo = el.dataset.tipo;

                // Determinar posición inicial centrada por defecto
                const canvasEl = this.canvasController.canvasElement;
                const startX = (canvasEl.clientWidth / 2) - 50;
                const startY = (canvasEl.clientHeight / 2) - 20;

                // Añadir a través del controlador del lienzo e iniciar arrastre de forma inmediata
                const nuevoComp = this.canvasController.addComponentFromToolbar(tipo, startX + canvasEl.getBoundingClientRect().left + 50, startY + canvasEl.getBoundingClientRect().top + 20);
                this.canvasController.iniciarArrastreDesdeId(e, nuevoComp.id);
            });
        });
    }
}