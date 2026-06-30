import { Project } from './domain/Project.js';
import { CanvasController } from './controllers/CanvasController.js';
import { ToolbarController } from './controllers/ToolbarController.js';
import { CodeController } from './controllers/CodeController.js';
import { ProjectManager } from './application/ProjectManager.js';
import { ProjectWizardController } from './controllers/ProjectWizardController.js';

// --- ESTADO GLOBAL DEL IDE ---
let currentFiles = {}; // Diccionario en memoria con los archivos del proyecto
let activeFileName = '';

// Nodos de UI
const startScreen = document.getElementById('start-screen');
const ideContainer = document.getElementById('ide-container');
const fileExplorer = document.getElementById('file-explorer');
const toolbar = document.getElementById('toolbar');
const canvasWrapper = document.getElementById('canvas-wrapper');
const fileTree = document.getElementById('file-tree');
const currentFileLabel = document.getElementById('current-file-label');

const textareaElement = document.getElementById('codigoTextarea');
const canvasElement = document.getElementById('canvas');

// Inicializar Controladores Base
const project = new Project('');
const canvasController = new CanvasController(project, canvasElement);
const toolbarController = new ToolbarController(toolbar, canvasController);
const codeController = new CodeController(project, textareaElement, document.getElementById('insertarComp'), document.getElementById('descargar'));

// Modal de Proyecto
const modalProyecto = document.getElementById('modal-proyecto');
new ProjectWizardController(modalProyecto); // Asumiendo que adaptas el wizard para usar este modal

// --- LÓGICA DE NAVEGACIÓN ---

function mostrarIDE(modo) {
    startScreen.style.display = 'none';
    ideContainer.style.display = 'flex';

    if (modo === 'archivo_suelto') {
        fileExplorer.style.display = 'none';
        toolbar.style.display = 'flex';
        canvasWrapper.style.display = 'flex';
        project.baseCode = ProjectManager.getPlantillaPorDefecto();
        textareaElement.value = project.baseCode;
        currentFileLabel.textContent = "main.c (Visual)";
    } else if (modo === 'proyecto') {
        fileExplorer.style.display = 'flex';
        toolbar.style.display = 'none';
        canvasWrapper.style.display = 'none'; // Oculto hasta abrir un archivo de UI
        renderizarArbolArchivos();
    }
}

// Al hacer clic en un archivo del explorador
function abrirArchivo(nombreRuta) {
    // Guardar estado del archivo anterior
    if (activeFileName) {
        currentFiles[activeFileName] = textareaElement.value;
    }

    activeFileName = nombreRuta;
    currentFileLabel.textContent = nombreRuta;

    // Cargar contenido al textarea y al dominio
    const contenido = currentFiles[nombreRuta] || '';
    project.baseCode = contenido;
    textareaElement.value = contenido;

    // MAGIA: Determinar si es capa de View (UI)
    if (nombreRuta.includes('views/')) {
        fileExplorer.style.display = 'none';
        toolbar.style.display = 'flex';
        canvasWrapper.style.display = 'flex';

        // Limpiar canvas anterior para este nuevo archivo
        project.components = [];
        canvasController.renderer.limpiar();
    } else {
        fileExplorer.style.display = 'flex';
        toolbar.style.display = 'none';
        canvasWrapper.style.display = 'none';
    }

    // Actualizar CSS del árbol
    document.querySelectorAll('.archivo-item').forEach(el => el.classList.remove('activo'));
    const activeEl = document.querySelector(`.archivo-item[data-ruta="${nombreRuta}"]`);
    if (activeEl) activeEl.classList.add('activo');
}

function renderizarArbolArchivos() {
    fileTree.innerHTML = '';
    let carpetasVistas = new Set();

    Object.keys(currentFiles).sort().forEach(ruta => {
        const partes = ruta.split('/');
        const archivo = partes.pop();
        const carpeta = partes.join('/');

        // Simular headers de carpeta
        if (carpeta && !carpetasVistas.has(carpeta)) {
            const divDir = document.createElement('div');
            divDir.className = 'archivo-item carpeta';
            divDir.textContent = `📂 ${carpeta}`;
            fileTree.appendChild(divDir);
            carpetasVistas.add(carpeta);
        }

        const divArch = document.createElement('div');
        divArch.className = 'archivo-item';
        divArch.textContent = `📄 ${archivo}`;
        divArch.dataset.ruta = ruta;
        divArch.style.paddingLeft = carpeta ? '15px' : '5px';

        divArch.addEventListener('click', () => abrirArchivo(ruta));
        fileTree.appendChild(divArch);
    });

    // Abrir el main.c por defecto si existe
    const mainPath = Object.keys(currentFiles).find(r => r.endsWith('main.c'));
    if (mainPath) abrirArchivo(mainPath);
}

// --- EVENTOS DE INTERFAZ GLOBAL ---

document.getElementById('btn-start-archivo').addEventListener('click', () => {
    mostrarIDE('archivo_suelto');
});

document.getElementById('btn-start-proyecto').addEventListener('click', () => {
    modalProyecto.style.display = 'flex';
});

// Interceptar la generación del wizard para cargar en memoria en vez de ZIP inmediato
document.getElementById('btn-generar-proyecto').addEventListener('click', () => {
    const name = document.getElementById('proj-name').value.trim();
    const useDB = document.getElementById('use-db').checked;
    const dbType = document.querySelector('input[name="db-type"]:checked')?.value || '';

    if (!name) return alert('Ingresa un nombre');

    // Generar proyecto virtual (Reutilizando tu ProjectManager actual)
    currentFiles = ProjectManager.generarEstructuraProyectoC(name, useDB, dbType);

    // Forzamos la creación de una carpeta views de ejemplo para poder probar el Canvas
    currentFiles[`${name}/src/views/main_window.c`] = `// Archivo UI visual\n#include <libgraph3.h>\n\nvoid draw_window() {\n    //COMPONENTES\n}\n`;

    modalProyecto.style.display = 'none';
    mostrarIDE('proyecto');
});

document.getElementById('btn-volver-archivos').addEventListener('click', () => {
    toolbar.style.display = 'none';
    canvasWrapper.style.display = 'none';
    fileExplorer.style.display = 'flex';
});

// Limpieza extra
document.getElementById('limpiarCanvas').addEventListener('click', () => {
    if (confirm('¿Eliminar todos los componentes del lienzo?')) {
        project.components = [];
        canvasController.renderer.limpiar();
    }
});