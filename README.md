📐 libgraph3_web_IDE_ligero
IDE visual para generar código C con libgraph3 y arquitectura limpia

https://img.shields.io/badge/versi%C3%B3n-1.0.0-blue
https://img.shields.io/badge/estado-estable-brightgreen
https://img.shields.io/badge/licencia-MIT-green

🚀 Descripción
libgraph3_web_IDE_ligero es un entorno de desarrollo integrado (IDE) basado en web que permite crear visualmente interfaces gráficas para la librería libgraph3 (BGI moderno para Linux) y generar proyectos C con arquitectura limpia. Está diseñado para estudiantes de ingeniería de software y desarrolladores que deseen prototipar rápidamente aplicaciones gráficas en C sin necesidad de escribir código manualmente.

El IDE combina:

Un lienzo visual donde se arrastran componentes (botones, texto, rectángulos, campos de texto)

Un generador de código C que produce automáticamente el código fuente

Un asistente de proyectos que crea estructuras completas con separación de capas (entidades, casos de uso, interfaces, infraestructura)

Soporte para bases de datos (MariaDB y SQLite)

✨ Características principales
🎨 Editor visual
Arrastrar y soltar componentes desde la barra de herramientas al lienzo

Mover componentes arrastrándolos con el ratón

Edición de propiedades mediante doble clic (texto, comandos)

Vista previa en tiempo real del diseño

Estilos diferenciados para cada tipo de componente

⚙️ Generación de código C
Genera código compatible con libgraph3 (SDL3)

Soporte para botones interactivos que ejecutan comandos system()

Campos de texto con captura de entrada del usuario

Rectángulos, texto estático y formas básicas

Código limpio, indentado y comentado

📁 Generación de proyectos
Arquitectura limpia en C:

entities/ – Entidades de negocio

usecases/ – Casos de uso

interfaces/ – Contratos (repositorios)

infrastructure/ – Implementaciones concretas

Soporte para bases de datos:

MariaDB

SQLite

Repositorio en archivo (sin BD)

CMakeLists.txt generado automáticamente

README.md y .gitignore incluidos

Descarga del proyecto completo en ZIP

💻 Tecnologías utilizadas
HTML5 / CSS3 – Interfaz de usuario

JavaScript (ES6+) – Lógica del IDE

JSZip – Empaquetado de proyectos

localStorage – Persistencia temporal de código

📂 Estructura del proyecto
text
libgraph3_web_IDE_ligero/
├── crearArchivo.html      # Página de inicio (crear/cargar proyectos)
├── editor.html            # Editor visual principal
├── README.md              # Este archivo
└── (próximamente)         # Archivos de configuración y assets
🔧 Instalación y uso
1. Clonar el repositorio
bash
git clone https://github.com/Yahir2005/libgraph3_web_IDE_ligero.git
cd libgraph3_web_IDE_ligero
2. Abrir la aplicación
No necesitas servidor web. Abre crearArchivo.html directamente en tu navegador:

bash
# En Linux/macOS
open crearArchivo.html

# En Windows
start crearArchivo.html
3. Flujo de trabajo
Inicio (crearArchivo.html):

📝 Nuevo archivo .c – Crea un código base y abre el editor

📂 Cargar archivo .c – Carga un archivo existente

📁 Crear proyecto C – Asistente para generar un proyecto completo

Editor (editor.html):

Arrastra componentes desde la barra lateral al lienzo

Mueve los componentes arrastrándolos

Haz doble clic para editar propiedades

Haz clic en Insertar componentes para generar código C

Edita el código manualmente en el panel derecho

Descarga el archivo .c o limpia el lienzo

Crear proyecto C (desde la página de inicio):

Ingresa el nombre del proyecto

Selecciona si usará base de datos

Elige entre MariaDB o SQLite

Descarga el ZIP con la estructura completa

4. Compilar el código generado
bash
# Compilar archivo .c individual
gcc mi_programa.c -o mi_programa -lgraph3 -lm

# Ejecutar
./mi_programa

# Compilar proyecto completo (con CMake)
cd mi_proyecto
mkdir build && cd build
cmake ..
make
./mi_proyecto
📚 Ejemplo de código generado
Cuando arrastras un botón, un campo de texto y un rectángulo, el generador produce algo como:

c
#include <libgraph3.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int gd = DETECT, gm;
    initgraph(&gd, &gm, "");
    setbkcolor(WHITE);
    cleardevice();

    // Botón: "Saludar"
    setcolor(BLACK);
    setfillstyle(SOLID_FILL, LIGHTBLUE);
    bar(200, 150, 300, 190);
    setcolor(BLACK);
    outtextxy(206, 156, "Saludar");

    // Campo de texto: "Nombre:"
    setcolor(BLACK);
    outtextxy(50, 100, "Nombre:");
    setcolor(BLACK);
    rectangle(150, 95, 350, 125);
    setfillstyle(EMPTY_FILL, WHITE);
    bar(151, 96, 349, 124);

    // Rectángulo
    setcolor(RED);
    rectangle(100, 200, 200, 250);

    getch();
    closegraph();
    return 0;
}
🛠️ Tecnologías y dependencias
Tecnología	Versión	Uso
HTML5	-	Estructura de la interfaz
CSS3	-	Estilos visuales
JavaScript ES6	-	Lógica de la aplicación
JSZip	3.10.1	Empaquetado de proyectos en ZIP
libgraph3	3.x	Librería gráfica para el código generado
SDL3	-	Dependencia de libgraph3
Dependencias para el código generado (en el sistema Linux)
bash
sudo apt update
sudo apt install build-essential cmake git libsdl3-dev libfreetype-dev
🤝 Cómo contribuir
¡Las contribuciones son bienvenidas! Sigue estos pasos:

Fork el repositorio

Crea una rama para tu feature:

bash
git checkout -b feature/nueva-funcionalidad
Realiza tus cambios y haz commit:

bash
git commit -m "Añadir nueva funcionalidad"
Push a tu rama:

bash
git push origin feature/nueva-funcionalidad
Abre un Pull Request

Ideas para contribuir
Añadir más componentes (checkbox, radio, dropdown)

Soporte para PostgreSQL

Generación de Makefile en lugar de CMake

Modo oscuro/claro

Exportar a HTML + JavaScript

Integración con compilador web (WebAssembly)

📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

👨‍💻 Autor
Yahir2005

GitHub: @Yahir2005

🙏 Agradecimientos
Proyecto inspirado en la antigua libgraph y libgraph2

Comunidad de SDL3 y libgraph3 por su excelente trabajo

A todos los estudiantes y desarrolladores que usan esta herramienta

📧 Contacto
Si tienes preguntas, sugerencias o encuentras algún problema, por favor abre un issue en el repositorio o contacta al autor.

¡Disfruta programando con libgraph3_web_IDE_ligero! 🚀