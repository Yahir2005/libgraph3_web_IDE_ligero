export class ProjectManager {
    static guardarCodigoLocal(codigo) { localStorage.setItem('codigoC', codigo); }
    static cargarCodigoLocal() { return localStorage.getItem('codigoC') || ''; }
}