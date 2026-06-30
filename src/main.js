// main.js
import { Project } from './domain/Project.js';
import { CanvasController } from './controllers/CanvasController.js';
import { ToolbarController } from './controllers/ToolbarController.js';
import { CodeController } from './controllers/CodeController.js';
import { CodeGenerator } from './application/CodeGenerator.js';

// --- Obtener referencias del DOM ---
const canvasElement = document.getElementById('canvas');
const toolbarElement = document.getElementById('toolbar');
const textareaElement = document.getElementById('codigoTextarea');
const insertBtn = document.getElementById('insertarComp');
const downloadBtn = document.getElementById('descargar');

// --- Inicializar Proyecto (Estado Global) ---
const project = new Project();
// Cargar código guardado o default
const savedCode = localStorage.getItem('codigoC') ||
    `#include <libgraph3.h>\n\nint main() {\n    int gd = DETECT, gm;\n    initgraph(&gd, &gm, "");\n    setbkcolor(WHITE);\n    cleardevice();\n\n    //COMPONENTES\n\n    getch();\n    closegraph();\n    return 0;\n}\n`;
project.baseCode = savedCode;
textareaElement.value = savedCode;

// --- Controladores (se inyectan las dependencias) ---
const canvasController = new CanvasController(project, canvasElement);
const toolbarController = new ToolbarController(toolbarElement, canvasController);
const codeController = new CodeController(project, textareaElement, insertBtn, downloadBtn);

// --- Renderizar estado inicial ---
canvasController.renderer.render(project.components);