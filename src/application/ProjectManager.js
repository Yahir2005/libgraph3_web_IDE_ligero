export class ProjectManager {
    static KEY_CODIGO = 'codigoC';

    static guardarCodigoLocal(codigo) {
        localStorage.setItem(this.KEY_CODIGO, codigo);
    }

    static cargarCodigoLocal() {
        return localStorage.getItem(this.KEY_CODIGO) || this.getPlantillaPorDefecto();
    }

    static getPlantillaPorDefecto() {
        return `#include <libgraph3.h>\n\nint main() {\n    int gd = DETECT, gm;\n    initgraph(&gd, &gm, "");\n    setbkcolor(WHITE);\n    cleardevice();\n\n    //COMPONENTES\n\n    getch();\n    closegraph();\n    return 0;\n}\n`;
    }

    static generarEstructuraProyectoC(nombre, usarBD, tipoBD) {
        const archivos = {};
        const basePath = `${nombre}/src/`;

        // 1. Entidades
        archivos[`${basePath}entities/user.h`] = `#ifndef USER_H\n#define USER_H\n\ntypedef struct {\n    int id;\n    char name[50];\n    char email[50];\n} User;\n\nUser* create_user(int id, const char* name, const char* email);\nvoid destroy_user(User* user);\n\n#endif\n`;
        archivos[`${basePath}entities/user.c`] = `#include "user.h"\n#include <stdlib.h>\n#include <string.h>\n\nUser* create_user(int id, const char* name, const char* email) {\n    User* u = (User*)malloc(sizeof(User));\n    u->id = id;\n    strcpy(u->name, name);\n    strcpy(u->email, email);\n    return u;\n}\n\nvoid destroy_user(User* user) {\n    free(user);\n}\n`;

        // 2. Interfaces
        archivos[`${basePath}interfaces/user_repository.h`] = `#ifndef USER_REPOSITORY_H\n#define USER_REPOSITORY_H\n\n#include "../entities/user.h"\n\ntypedef struct UserRepository {\n    int (*save)(User* user);\n    User* (*find_by_id)(int id);\n} UserRepository;\n\n#endif\n`;

        // 3. Casos de Uso
        archivos[`${basePath}usecases/register_user.h`] = `#ifndef REGISTER_USER_H\n#define REGISTER_USER_H\n\n#include "../entities/user.h"\n#include "../interfaces/user_repository.h"\n\nint register_user(UserRepository* repo, const char* name, const char* email);\n\n#endif\n`;
        archivos[`${basePath}usecases/register_user.c`] = `#include "register_user.h"\n#include <stdlib.h>\n#include <string.h>\n\nint register_user(UserRepository* repo, const char* name, const char* email) {\n    User* u = create_user(1, name, email);\n    int result = repo->save(u);\n    destroy_user(u);\n    return result;\n}\n`;

        // 4. Infraestructura
        if (usarBD && tipoBD === 'mariadb') {
            archivos[`${basePath}infrastructure/mariadb_user_repository.h`] = `#ifndef MARIADB_USER_REPOSITORY_H\n#define MARIADB_USER_REPOSITORY_H\n\n#include "../interfaces/user_repository.h"\n\nUserRepository* create_mariadb_repository();\n\n#endif\n`;
            archivos[`${basePath}infrastructure/mariadb_user_repository.c`] = `#include "mariadb_user_repository.h"\n#include <stdlib.h>\n#include <stdio.h>\n\nstatic int save_to_mariadb(User* user) {\n    printf("Guardando usuario %s en MariaDB\\n", user->name);\n    return 0;\n}\n\nUserRepository* create_mariadb_repository() {\n    UserRepository* repo = (UserRepository*)malloc(sizeof(UserRepository));\n    repo->save = save_to_mariadb;\n    repo->find_by_id = NULL;\n    return repo;\n}\n`;
        } else if (usarBD && tipoBD === 'sqlite') {
            archivos[`${basePath}infrastructure/sqlite_user_repository.h`] = `#ifndef SQLITE_USER_REPOSITORY_H\n#define SQLITE_USER_REPOSITORY_H\n\n#include "../interfaces/user_repository.h"\n\nUserRepository* create_sqlite_repository();\n\n#endif\n`;
            archivos[`${basePath}infrastructure/sqlite_user_repository.c`] = `#include "sqlite_user_repository.h"\n#include <stdlib.h>\n#include <stdio.h>\n\nstatic int save_to_sqlite(User* user) {\n    printf("Guardando usuario %s en SQLite\\n", user->name);\n    return 0;\n}\n\nUserRepository* create_sqlite_repository() {\n    UserRepository* repo = (UserRepository*)malloc(sizeof(UserRepository));\n    repo->save = save_to_sqlite;\n    repo->find_by_id = NULL;\n    return repo;\n}\n`;
        } else {
            archivos[`${basePath}infrastructure/file_user_repository.h`] = `#ifndef FILE_USER_REPOSITORY_H\n#define FILE_USER_REPOSITORY_H\n\n#include "../interfaces/user_repository.h"\n\nUserRepository* create_file_repository();\n\n#endif\n`;
            archivos[`${basePath}infrastructure/file_user_repository.c`] = `#include "file_user_repository.h"\n#include <stdlib.h>\n#include <stdio.h>\n\nstatic int save_to_file(User* user) {\n    FILE* f = fopen("users.txt", "a");\n    if (!f) return -1;\n    fprintf(f, "%d,%s,%s\\n", user->id, user->name, user->email);\n    fclose(f);\n    return 0;\n}\n\nUserRepository* create_file_repository() {\n    UserRepository* repo = (UserRepository*)malloc(sizeof(UserRepository));\n    repo->save = save_to_file;\n    repo->find_by_id = NULL;\n    return repo;\n}\n`;
        }

        // 5. main.c
        let mainContent = `#include <stdio.h>\n#include "usecases/register_user.h"\n`;
        if (usarBD && tipoBD === 'mariadb') mainContent += `#include "infrastructure/mariadb_user_repository.h"\n\n`;
        else if (usarBD && tipoBD === 'sqlite') mainContent += `#include "infrastructure/sqlite_user_repository.h"\n\n`;
        else mainContent += `#include "infrastructure/file_user_repository.h"\n\n`;

        mainContent += `int main() {\n    UserRepository* repo = `;
        if (usarBD && tipoBD === 'mariadb') mainContent += `create_mariadb_repository()`;
        else if (usarBD && tipoBD === 'sqlite') mainContent += `create_sqlite_repository()`;
        else mainContent += `create_file_repository()`;

        mainContent += `;\n\n    if (register_user(repo, "Juan Pérez", "juan@example.com") == 0) {\n        printf("Usuario registrado exitosamente.\\n");\n    } else {\n        printf("Error al registrar usuario.\\n");\n    }\n\n    free(repo);\n    return 0;\n}\n`;
        archivos[`${basePath}main.c`] = mainContent;

        // 6. CMakeLists.txt
        let cmake = `cmake_minimum_required(VERSION 3.10)\nproject(${nombre})\n\nset(CMAKE_C_STANDARD 99)\n\n`;
        if (usarBD && tipoBD === 'mariadb') cmake += `find_package(MariaDB REQUIRED)\n`;
        else if (usarBD && tipoBD === 'sqlite') cmake += `find_package(SQLite3 REQUIRED)\n`;

        cmake += `\nadd_executable(${nombre}\n    src/main.c\n    src/entities/user.c\n    src/usecases/register_user.c\n    src/infrastructure/file_user_repository.c\n`;
        if (usarBD && tipoBD === 'mariadb') cmake += `    src/infrastructure/mariadb_user_repository.c\n`;
        else if (usarBD && tipoBD === 'sqlite') cmake += `    src/infrastructure/sqlite_user_repository.c\n`;
        cmake += `)\n\n`;

        if (usarBD && tipoBD === 'mariadb') cmake += `target_link_libraries(${nombre} mariadb)\n`;
        else if (usarBD && tipoBD === 'sqlite') cmake += `target_link_libraries(${nombre} SQLite3)\n`;
        archivos[`${nombre}/CMakeLists.txt`] = cmake;

        // 7. Documentación y entorno
        archivos[`${nombre}/README.md`] = `# ${nombre}\n\nProyecto generado con libgraph3 IDE.\n`;
        archivos[`${nombre}/.gitignore`] = `build/\n*.o\n*.so\n*.a\n*.out\n${nombre}\nusers.txt\n`;

        return archivos;
    }
}