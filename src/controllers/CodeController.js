import { CodeGenerator } from '../application/CodeGenerator.js';
import { ProjectManager } from '../application/ProjectManager.js';
import { FileExporter } from '../application/FileExporter.js';

export class CodeController {
    constructor(project, textareaElement, insertBtn, downloadBtn) {
        this.project = project;
        this.textarea = textareaElement;

        this.textarea.addEventListener('input', (e) => {
            this.project.baseCode = e.target.value;
            ProjectManager.guardarCodigoLocal(e.target.value);
        });

        if (insertBtn) insertBtn.addEventListener('click', () => this.inyectarComponentes());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.descargarCodigoC());
    }

    inyectarComponentes() {
        let codigo = this.project.baseCode;
        const bloqueC = `// === INICIO COMPONENTES ===\n${CodeGenerator.generate(this.project.components)}\n    // === FIN COMPONENTES ===`;
        const regexBloque = /\/\/\s*===\s*INICIO COMPONENTES\s*===[^]*?\/\/\s*===\s*FIN COMPONENTES\s*===/g;

        if (regexBloque.test(codigo)) {
            codigo = codigo.replace(regexBloque, bloqueC);
        } else {
            const marcadorOriginal = /\/\/\s*COMPONENTES/g;
            if (marcadorOriginal.test(codigo)) {
                codigo = codigo.replace(marcadorOriginal, bloqueC);
            } else {
                const posGetch = codigo.lastIndexOf('getch()');
                if (posGetch !== -1) codigo = codigo.substring(0, posGetch) + bloqueC + '\n    ' + codigo.substring(posGetch);
                else codigo += '\n' + bloqueC;
            }
        }

        this.project.baseCode = codigo;
        this.textarea.value = codigo;
        ProjectManager.guardarCodigoLocal(codigo);
    }

    descargarCodigoC() { FileExporter.descargarArchivoTexto(this.project.baseCode, 'main.c'); }
}