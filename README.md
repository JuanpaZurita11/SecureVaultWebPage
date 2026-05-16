🔒 Secure Vault Web

Una aplicación web diseñada para la gestión segura de información, que incluye un sistema de autenticación, agenda de contactos y un almacén cifrado de archivos. El proyecto utiliza una arquitectura cliente-servidor local apoyada en tecnologías web estándar.

🛠️ Entorno de Desarrollo

Para el desarrollo y pruebas locales de este proyecto se utiliza XAMPP, una distribución de Apache que integra MariaDB (MySQL), PHP y Perl. Este paquete emula un entorno de servidor web completo en una máquina local.

📦 Componentes Principales

+ Servidor HTTP Apache: Procesa las peticiones entrantes, interpreta los archivos del proyecto y sirve las páginas web al navegador.

+ MySQL Database: Sistema de gestión de bases de datos relacionales utilizado para almacenar credenciales, llaves criptográficas y metadatos de los archivos.

🚀 Instalación de XAMPP

Sigue estos pasos para configurar el entorno:

1. **Descargar el instalador de XAMPP**:
2. **Iniciar Servicios**:

Después de arranacar XAMPP, abre el Panel de Control de XAMPP e inicia los módulos de Apache y MySQL. En Linux, puedes usar la terminal para iniciar el servicio de lampp.

💻 Despliegue y Pruebas Locales (Linux)

Para probar la aplicación en un entorno Linux, sigue este procedimiento:

1. Ubicación del Proyecto

Descarga el repositorio y mueve la carpeta del proyecto a la ruta raíz del servidor web de XAMPP:

/opt/lampp/htdocs/

(Se recomienda usar un nombre de carpeta sencillo sin espacios, por ejemplo: secure_vault).

2. Configuración de la Base de Datos

Para que la aplicación funcion es indispensable configurar la base de datos. Desafortunamente no hay un script para hacer la migración por lo que se tendrá que hacer manual. 

+ Accede a la interfaz de gestión desde tu navegador: http://localhost/phpmyadmin/.
+ Crea una nueva base de datos llamada estrictamente: secure_vault.
+ Crea las siguientes tablas. A continuación se muestra el esquema relacional:
  
```mermai
erDiagram
    usuarios {
        int id PK "AUTO_INCREMENT"
        varchar usuario "50 - NOT NULL"
        varchar nombre "100"
        varchar apellido "100"
        varchar correo "150"
        text contrasena
        text llave_publica
        text llave_privada
    }

    contactos {
        int id PK "AUTO_INCREMENT"
        int usuario_id FK
        int contacto_id FK
    }

    archivos {
        int id PK "AUTO_INCREMENT"
        int usuario_id FK
        varchar nombre "255"
        bigint tamano
        longtext metadatos "utf8mb4_bin"
        mediumblob contenido
        longtext destinatarios "utf8mb4_bin"
        datetime timestamp "current_timestamp()"
    }

    usuarios ||--o{ contactos : "gestiona"
    usuarios ||--o{ archivos : "almacena"
``

3. Carga de Datos de Prueba

Para validar el funcionamiento (Login y visualización), inserta manualmente al menos dos usuarios de prueba en la tabla usuarios y genera una relación en la tabla contactos.

4. Ejecución

Para ver la página en funcionamiento, abre el navegador e ingresa a:

http://localhost/<nombre_de_tu_carpeta>
