export class FileExporter {
    static descargarArchivoTexto(contenido, nombreArchivo) {
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = nombreArchivo; a.click();
        URL.revokeObjectURL(url);
    }
}