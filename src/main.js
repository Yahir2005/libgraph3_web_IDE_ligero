import { Project } from './domain/Project.js';
import { CanvasController } from './controllers/CanvasController.js';
import { ToolbarController } from './controllers/ToolbarController.js';
import { CodeController } from './controllers/CodeController.js';
import { ExplorerController } from './controllers/ExplorerController.js';
import { ProjectManager } from './application/ProjectManager.js';

// --- Inicialización del Estado ---
const project = new Project(ProjectManager.cargarCodigoLocal());

// --- Inicialización de Controladores Básicos ---
const canvasController = new CanvasController(project, document.getElementById('canvas'));
const toolbarController = new ToolbarController(document.getElementById('toolbar-ui'), canvasController);
const codeController = new CodeController(project, document.getElementById('codigoTextarea'), document.getElementById('insertarComp'));

document.getElementById('codigoTextarea').value = project.baseCode;
canvasController.renderer.render(project.components);

document.getElementById('limpiarCanvas').addEventListener('click', () => {
    if (confirm('¿Eliminar todos los componentes del lienzo?')) { project.components = []; canvasController.renderer.limpiar(); }
});

// --- Explorador Dinámico y FileSystem ---
const explorerController = new ExplorerController(
    document.getElementById('tree-container'),
    document.getElementById('btn-abrir-carpeta'),
    project,
    codeController
);

const guardarBtn = document.getElementById('guardarReal');
if (guardarBtn) {
    guardarBtn.addEventListener('click', () => {
        const codigoFinal = document.getElementById('codigoTextarea').value;
        explorerController.saveCurrentFile(codigoFinal);
    });
}

// ==========================================
// LÓGICA DE INTERFAZ: MODO UI vs MODO CÓDIGO
// ==========================================
const menuArchivo = document.getElementById('menu-archivo');

document.addEventListener('click', () => { menuArchivo.style.display = 'none'; });

document.getElementById('opt-editar-ui').addEventListener('click', () => {
    document.getElementById('toolbar-ui').style.display = 'flex';
    document.getElementById('toolbar-codigo').style.display = 'none';
    document.getElementById('canvas-wrapper').style.display = 'flex';
    document.getElementById('codigo-wrapper').style.display = 'none';
});

document.getElementById('opt-ver-codigo').addEventListener('click', () => {
    document.getElementById('toolbar-ui').style.display = 'none';
    document.getElementById('toolbar-codigo').style.display = 'flex';
    document.getElementById('canvas-wrapper').style.display = 'none';
    document.getElementById('codigo-wrapper').style.display = 'flex';
});