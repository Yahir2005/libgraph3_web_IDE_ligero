import { CodeGenerator } from '../application/CodeGenerator.js';
import { ProjectManager } from '../application/ProjectManager.js';
import { FileExporter } from '../application/FileExporter.js';

export class CodeController {
    constructor(project, textareaElement, insertBtn, downloadBtn) {
        this.project = project;
        this.textarea = textareaElement;

        // Escuchar cambios manuales en el editor
        this.textarea.addEventListener('input', (e) => {
            this.project.baseCode = e.target.value;
            ProjectManager.guardarCodigoLocal(e.target.value);
        });

        // Vincular acciones de los botones
        if (insertBtn) insertBtn.addEventListener('click', () => this.inyectarComponentes());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.descargarCodigoC());
    }

    inyectarComponentes() {
        let codigo = this.project.baseCode;
        const bloqueC = CodeGenerator.generate(this.project.components);
        const marcador = /\/\/\s*COMPONENTES/g;

        if (marcador.test(codigo)) {
            codigo = codigo.replace(marcador, bloqueC);
        } else {
            const posGetch = codigo.lastIndexOf('getch()');
            if (posGetch !== -1) {
                codigo = codigo.substring(0, posGetch) + bloqueC + '\n    ' + codigo.substring(posGetch);
            } else {
                codigo = codigo + '\n' + bloqueC;
            }
        }

        this.project.baseCode = codigo;
        this.textarea.value = codigo;
        ProjectManager.guardarCodigoLocal(codigo);
    }

    descargarCodigoC() {
        FileExporter.descargarArchivoTexto(this.project.baseCode, 'proyecto.c');
    }
}