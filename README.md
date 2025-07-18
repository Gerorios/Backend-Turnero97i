# ProSalud Backend

**ProSalud** es un proyecto orientado a la gestión de turnos médicos y estudios de diagnóstico, que permite a los pacientes agendar citas en línea y a los médicos aceptar o rechazar solicitudes de forma remota. Está diseñado para escalabilidad futura..

## Tecnologías
* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JSON Web Tokens (JWT)** para autenticación
* **dotenv** para manejo de variables de entorno
* **Nodemailer** para envío de notificaciones por correo electrónico

## Requisitos previos

* [Node.js](https://nodejs.org/) (v14 o superior)
* [npm](https://www.npmjs.com/) (v6 o superior)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/TU_USUARIO/ProSalud-backend.git
   cd ProSalud-backend
   ```
2. Instala dependencias:

   ```bash
   npm install
   ```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```dotenv
PORT=5000
MONGO_CONNECTION=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/turnos_medicos
JWT_SECRETPASS=unaClaveSecreta
```

* **PORT**: puerto donde correrá el servidor.
* **MONGO\_CONNECTION**: URI de conexión a MongoDB Atlas o local.
* **JWT\_SECRETPASS**: clave secreta para firmar JWT.


## Scripts disponibles

* `npm start` - Inicia el servidor en modo producción.
* `npm run dev` - Inicia el servidor con Nodemon en modo desarrollo.


## Integrantes

* Salustiano Robles Teran
* Geronimo Rios Antenucci
* Ignacio Albarracín
* Mercedes Magali Navarro
* Gonzalo Martínez


