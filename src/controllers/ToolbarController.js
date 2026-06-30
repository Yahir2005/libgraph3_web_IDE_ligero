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
                this.canvasController.iniciarArrastreDesdeToolbar(e, el.dataset.tipo);
            });
        });
    }
}