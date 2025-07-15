# Table Plus - Frontend (React + Vite)

Este es el frontend para la aplicación de gestión de tareas "Table Plus", desarrollado con React.

## Acerca del Proyecto

Esta aplicación proporciona la interfaz de usuario para que los usuarios puedan registrarse, iniciar sesión y gestionar sus tareas diarias de manera eficiente. Se conecta con un backend de Laravel para la lógica de negocio y la persistencia de datos.

### Desarrollado con

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Axios](https://axios-http.com/)
* [React Router](https://reactrouter.com/)

---

## Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado Node.js y npm en tu sistema.
* **npm**
    ```sh
    npm install npm@latest -g
    ```

### Instalación

1.  **Clona el repositorio**
    ```sh
    git clone [https://github.com/tu-usuario/table-plus-frontend.git](https://github.com/tu-usuario/table-plus-frontend.git)
    ```
2.  **Navega al directorio del proyecto**
    ```sh
    cd table-plus-frontend
    ```
3.  **Instala las dependencias de NPM**
    ```sh
    npm install
    ```
4.  **Configura la URL de la API**

    Abre el archivo `src/services/api.js` y asegúrate de que la `baseURL` apunte a tu backend de Laravel.
    ```javascript
    const api = axios.create({
      baseURL: '[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)', // URL de tu API
    });
    ```

### Uso

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:
```sh
npm run dev
```

Abre http://localhost:5173 (o el puerto que indique la terminal) en tu navegador para ver la aplicación.

## Funcionalidades
* ✅ Autenticación de usuarios (Registro e Inicio de Sesión).
* ✅ Gestión completa de tareas (Crear, Editar, Eliminar).
* ✅ Dashboard protegido para usuarios autenticados.
* ✅ Filtrado de tareas por título y estado.
* ✅ Subida de archivos adjuntos a las tareas.
* ✅ Configuración de recordatorios.
* ✅ Interfaz para descargar y restaurar backups en XML.
* ✅ Paginación para la lista de tareas.
