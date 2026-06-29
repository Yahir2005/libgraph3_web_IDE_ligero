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
    // Si ves este mensaje en la consola, ¡nuestro código nuevo está funcionando!
    console.log('¡La extensión libgraph3 está activa y lista!');
    let disposable = vscode.commands.registerCommand('libgraph3.abrirDisenador', () => {
        const panel = vscode.window.createWebviewPanel('libgraph3Designer', 'Diseñador UI BGI', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diseñador</title>
    <style>
        body { background-color: #1e1e1e; color: white; font-family: sans-serif; display: flex; }
        #toolbar { width: 200px; background: #252526; padding: 10px; border-right: 1px solid #3c3c3c; }
        #canvas-container { flex-grow: 1; padding: 20px; display: flex; justify-content: center; align-items: center; }
        #canvas { width: 640px; height: 480px; background: black; border: 2px solid #555; position: relative; }
        .componente { padding: 5px 10px; background: #007acc; margin-bottom: 10px; cursor: grab; text-align: center; }
    </style>
</head>
<body>
    <div id="toolbar">
        <h3>Herramientas</h3>
        <div class="componente" draggable="true">Botón</div>
        <div class="componente" draggable="true">Texto</div>
        <div class="componente" draggable="true">Rectángulo</div>
    </div>
    <div id="canvas-container">
        <div id="canvas">
            </div>
    </div>
</body>
</html>`;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map