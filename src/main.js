import { Project } from './domain/Project.js';
import { CanvasController } from './controllers/CanvasController.js';
import { ToolbarController } from './controllers/ToolbarController.js';
import { CodeController } from './controllers/CodeController.js';
import { ProjectManager } from './application/ProjectManager.js';

// Inicialización de Dependencias
const project = new Project(ProjectManager.cargarCodigoLocal());
const canvasController = new CanvasController(project, document.getElementById('canvas'));
const toolbarController = new ToolbarController(document.getElementById('toolbar-ui'), canvasController);
const codeController = new CodeController(project, document.getElementById('codigoTextarea'), document.getElementById('insertarComp'), document.getElementById('descargar'));

document.getElementById('codigoTextarea').value = project.baseCode;
canvasController.renderer.render(project.components);

document.getElementById('limpiarCanvas').addEventListener('click', () => {
    if (confirm('¿Eliminar todos los componentes del lienzo?')) { project.components = []; canvasController.renderer.limpiar(); }
});

// ==========================================
// LÓGICA DE INTERFAZ: MODO UI vs MODO CÓDIGO
// ==========================================
const fileInicio = document.getElementById('file-inicio');
const menuArchivo = document.getElementById('menu-archivo');

fileInicio.addEventListener('click', (e) => {
    e.stopPropagation();
    menuArchivo.style.display = 'flex';
    menuArchivo.style.left = `${e.clientX}px`;
    menuArchivo.style.top = `${e.clientY}px`;
});

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