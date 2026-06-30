import { Project } from './domain/Project.js';
import { CanvasController } from './controllers/CanvasController.js';
import { ToolbarController } from './controllers/ToolbarController.js';
import { CodeController } from './controllers/CodeController.js';
import { ProjectManager } from './application/ProjectManager.js';

// 1. Obtener nodos de la UI
const canvasElement = document.getElementById('canvas');
const toolbarElement = document.getElementById('toolbar');
const textareaElement = document.getElementById('codigoTextarea');
const insertBtn = document.getElementById('insertarComp');
const downloadBtn = document.getElementById('descargar');
const limpiarBtn = document.getElementById('limpiarCanvas');

// 2. Inicializar Estado del Dominio cargando desde persistencia
const codigoInicial = ProjectManager.cargarCodigoLocal();
const project = new Project(codigoInicial);

// 3. Inicializar Controladores e inyectar dependencias
const canvasController = new CanvasController(project, canvasElement);
const toolbarController = new ToolbarController(toolbarElement, canvasController);
const codeController = new CodeController(project, textareaElement, insertBtn, downloadBtn);

// 4. Funcionalidades extras globales de UI
if (limpiarBtn) {
    limpiarBtn.addEventListener('click', () => {
        if (confirm('¿Eliminar todos los componentes del lienzo?')) {
            project.components = [];
            canvasController.renderer.limpiar();
        }
    });
}

// 5. Renderizado Inicial de la Escena
canvasController.renderer.render(project.components);