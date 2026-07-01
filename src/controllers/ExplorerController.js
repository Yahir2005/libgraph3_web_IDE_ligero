import { FileSystem } from '../application/FileSystem.js';

export class ExplorerController {
    constructor(containerElement, btnOpen, project, codeController) {
        this.container = containerElement;
        this.btnOpen = btnOpen;
        this.project = project;
        this.codeController = codeController;
        this.currentFileHandle = null;

        this.btnOpen.addEventListener('click', () => this.loadDirectory());
    }

    async loadDirectory() {
        const dirHandle = await FileSystem.openDirectory();
        if (!dirHandle) return;

        this.container.innerHTML = '<div style="padding:15px; color:#007acc; text-align:center;">Cargando archivos...</div>';
        const files = await FileSystem.getFiles(dirHandle);

        const ul = document.createElement('ul');
        ul.className = 'tree-root';

        const rootLi = document.createElement('li');
        rootLi.innerHTML = `<div class="tree-folder"><span class="arrow">▼</span> 📦 ${dirHandle.name}</div>`;

        const childrenUl = this.buildTreeDOM(files);
        childrenUl.className = 'nested active';
        rootLi.appendChild(childrenUl);
        ul.appendChild(rootLi);

        this.container.innerHTML = '';
        this.container.appendChild(ul);

        this.bindTreeEvents();
    }

    buildTreeDOM(entries) {
        const ul = document.createElement('ul');
        ul.className = 'nested';

        entries.forEach(entry => {
            const li = document.createElement('li');
            if (entry.kind === 'directory') {
                li.innerHTML = `<div class="tree-folder"><span class="arrow">▶</span> 📁 ${entry.name}</div>`;
                li.appendChild(this.buildTreeDOM(entry.children));
            } else {
                li.className = 'tree-file';
                li.innerHTML = `📄 ${entry.name}`;
                li.dataset.path = entry.path;
                li.addEventListener('click', (e) => this.openFile(e, entry.handle, li));
            }
            ul.appendChild(li);
        });
        return ul;
    }

    async openFile(e, fileHandle, liElement) {
        document.querySelectorAll('.tree-file').forEach(el => el.classList.remove('activo'));
        liElement.classList.add('activo');

        const content = await FileSystem.readFile(fileHandle);
        this.currentFileHandle = fileHandle;

        this.project.baseCode = content;
        this.codeController.textarea.value = content;

        const menuArchivo = document.getElementById('menu-archivo');
        if (menuArchivo) {
            menuArchivo.style.display = 'flex';
            menuArchivo.style.left = `${e.clientX}px`;
            menuArchivo.style.top = `${e.clientY}px`;
        }
    }

    bindTreeEvents() {
        const folders = this.container.querySelectorAll('.tree-folder');
        folders.forEach(folder => {
            folder.addEventListener('click', function (e) {
                const nestedList = this.nextElementSibling;
                if (nestedList && nestedList.classList.contains('nested')) {
                    nestedList.classList.toggle('active');
                    const arrow = this.querySelector('.arrow');
                    if (arrow) arrow.textContent = nestedList.classList.contains('active') ? '▼' : '▶';
                }
            });
        });
    }

    async saveCurrentFile(content) {
        if (this.currentFileHandle) {
            await FileSystem.writeFile(this.currentFileHandle, content);
            alert('¡Archivo guardado con éxito!');
        } else {
            alert('No hay ningún archivo real abierto. Usa el explorador para abrir uno.');
        }
    }
}