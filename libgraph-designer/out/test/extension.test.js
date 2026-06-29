"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('¡La extensión libgraph3 está activa!');
    // Registramos el comando que definimos en package.json
    let disposable = vscode.commands.registerCommand('libgraph3.abrirDisenador', () => {
        // Creamos y mostramos un nuevo Webview
        const panel = vscode.window.createWebviewPanel('libgraph3Designer', // Identificador interno
        'Diseñador UI BGI', // Título de la pestaña
        vscode.ViewColumn.One, // Dónde se muestra (Columna 1)
        {
            enableScripts: true // ¡Vital para que funcione el Drag-and-Drop y JS!
        });
        // Le inyectamos el HTML inicial
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);
}
// Función que genera el HTML del lienzo
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diseñador</title>
    <style>
        body { background-color: #1e1e1e; color: white; font-family: sans-serif; display: flex; height: 100vh; margin: 0; }
        #toolbar { width: 200px; background: #252526; padding: 10px; border-right: 1px solid #3c3c3c; }
        #canvas-container { flex-grow: 1; padding: 20px; display: flex; justify-content: center; align-items: center; }
        /* El canvas simula nuestra pantalla de libgraph3 */
        #canvas { width: 640px; height: 480px; background: black; border: 2px solid #555; position: relative; overflow: hidden; }
        .componente { padding: 8px 10px; background: #007acc; margin-bottom: 10px; cursor: grab; text-align: center; border-radius: 4px; }
        
        /* Estilos para los elementos ya soltados en el lienzo */
        .elemento-lienzo { position: absolute; border: 1px dashed #888; cursor: pointer; user-select: none; }
        .elemento-lienzo.boton { background: #cccccc; color: black; padding: 5px 15px; border: 2px solid #fff; }
        .elemento-lienzo.texto { color: white; font-family: monospace; }
        .elemento-lienzo.rectangulo { border: 2px solid white; width: 100px; height: 50px; }
    </style>
</head>
<body>
    <div id="toolbar">
        <h3>Componentes</h3>
        <div class="componente" draggable="true" data-tipo="boton">Botón</div>
        <div class="componente" draggable="true" data-tipo="texto">Texto</div>
        <div class="componente" draggable="true" data-tipo="rectangulo">Rectángulo</div>
    </div>
    <div id="canvas-container">
        <div id="canvas"></div>
    </div>

<script>
        const componentes = document.querySelectorAll('.componente');
        const canvas = document.getElementById('canvas');

        /* --- 1. LÓGICA DE ARRASTRE DESDE LA BARRA AL LIENZO --- */
        componentes.forEach(comp => {
            comp.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('tipo', e.target.getAttribute('data-tipo'));
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault(); 
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const tipo = e.dataTransfer.getData('tipo');
            if (!tipo) return;

            const rect = canvas.getBoundingClientRect();
            const x = Math.round(e.clientX - rect.left - 40);
            const y = Math.round(e.clientY - rect.top - 15);

            const nuevoElemento = document.createElement('div');
            nuevoElemento.classList.add('elemento-lienzo', tipo);
            nuevoElemento.style.left = x + 'px';
            nuevoElemento.style.top = y + 'px';

            if (tipo === 'boton') nuevoElemento.innerText = 'Aceptar';
            if (tipo === 'texto') nuevoElemento.innerText = 'Texto de prueba';

            // ✅ FIX 1: Deshabilitar drag nativo del elemento en el lienzo
            nuevoElemento.setAttribute('draggable', 'false');

            canvas.appendChild(nuevoElemento);
        });

        /* --- 2. LÓGICA DE MOVIMIENTO DENTRO DEL LIENZO --- */
        let elementoActivo = null;
        let offsetX = 0;
        let offsetY = 0;

        // Cuando hacemos clic sobre un elemento que ya está en el lienzo
        canvas.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('elemento-lienzo')) {
                e.preventDefault();  // ✅ FIX 2: Evita que el navegador inicie un drag nativo
                e.stopPropagation();
                
                elementoActivo = e.target;
                const rectElemento = elementoActivo.getBoundingClientRect();
                offsetX = e.clientX - rectElemento.left;
                offsetY = e.clientY - rectElemento.top;
                elementoActivo.style.cursor = 'grabbing';
            }
        });
        
        // Cuando movemos el ratón por toda la ventana
        document.addEventListener('mousemove', (e) => {
            if (!elementoActivo) return;

            const rectCanvas = canvas.getBoundingClientRect();
            
            // Calculamos la nueva posición restando el offset inicial
            let nuevaX = e.clientX - rectCanvas.left - offsetX;
            let nuevaY = e.clientY - rectCanvas.top - offsetY;

            // Limites para que no se salga del lienzo (640x480)
            const maxW = canvas.clientWidth - elementoActivo.offsetWidth;
            const maxH = canvas.clientHeight - elementoActivo.offsetHeight;

            if (nuevaX < 0) nuevaX = 0;
            if (nuevaX > maxW) nuevaX = maxW;
            if (nuevaY < 0) nuevaY = 0;
            if (nuevaY > maxH) nuevaY = maxH;

            // Aplicamos las nuevas coordenadas
            elementoActivo.style.left = nuevaX + 'px';
            elementoActivo.style.top = nuevaY + 'px';
        });

        // Cuando soltamos el clic del ratón
        document.addEventListener('mouseup', () => {
            if (elementoActivo) {
                elementoActivo.style.cursor = 'pointer';
                elementoActivo = null; // Soltamos el elemento
            }
        });
    </script>

</body>
</html>`;
}
function deactivate() { }
//# sourceMappingURL=extension.test.js.map