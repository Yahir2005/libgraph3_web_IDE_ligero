import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Si ves este mensaje en la consola, ¡nuestro código nuevo está funcionando!
    console.log('¡La extensión libgraph3 está activa y lista!');

    let disposable = vscode.commands.registerCommand('libgraph3.abrirDisenador', () => {
        
        const panel = vscode.window.createWebviewPanel(
            'libgraph3Designer', 
            'Diseñador UI BGI', 
            vscode.ViewColumn.One, 
            {
                enableScripts: true 
            }
        );

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

export function deactivate() {}