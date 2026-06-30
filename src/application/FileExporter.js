export class FileExporter {
    static descargarArchivoTexto(contenido, nombreArchivo) {
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        URL.revokeObjectURL(url);
    }

    static async descargarProyectoZip(mapaArchivos, nombreProyecto) {
        // Asume que JSZip está disponible de forma global en el entorno de ejecución
        if (typeof JSZip === 'undefined') {
            throw new Error('La librería JSZip no está cargada en el entorno.');
        }

        const zip = new JSZip();
        for (const [ruta, contenido] of Object.entries(mapaArchivos)) {
            zip.file(ruta, contenido);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreProyecto}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }
}