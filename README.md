# Mitarea

Aplicación web SPA de gestión de tareas desarrollada como proyecto educativo.

Mitarea permite a los usuarios registrarse, iniciar sesión y administrar sus tareas personales de forma organizada, persistente y accesible desde cualquier dispositivo.

La aplicación utiliza **React + TypeScript** en el frontend, **Firebase Authentication** para la gestión de usuarios, **Cloud Firestore** para la persistencia y sincronización de tareas, **AWS SES** para el envío de resúmenes por correo electrónico y **Vercel** para el despliegue de la aplicación y la función Serverless encargada del envío de emails.

El proyecto fue desarrollado aplicando prácticas de arquitectura, separación de responsabilidades, tipado estático, testing automatizado, seguridad de datos, variables de entorno y control de versiones.

---

## Demo

**Aplicación desplegada en producción:**

[proyecto-m4-nahuel-cordoba.vercel.app](https://proyecto-m4-nahuel-cordoba.vercel.app/login)

La aplicación puede probarse directamente desde el entorno de producción.

Las funcionalidades principales disponibles incluyen:

* Registro de usuarios.
* Inicio y cierre de sesión.
* Protección de rutas.
* Gestión completa de tareas.
* Persistencia de datos en Firestore.
* Sincronización de tareas en tiempo real.
* Edición y eliminación de tareas.
* Cambio entre tareas pendientes y completadas.
* Envío de resumen de tareas por email.

---

## Índice

* [Demo](#demo)
* [Funcionalidades](#funcionalidades)

  * [Autenticación](#autenticación)
  * [Gestión de tareas](#gestión-de-tareas)
  * [Resumen por email](#resumen-por-email)
* [Tecnologías utilizadas](#tecnologías-utilizadas)
* [Requisitos previos](#requisitos-previos)
* [Instalación](#instalación)
* [Variables de entorno](#variables-de-entorno)

  * [Firebase](#firebase)
  * [AWS SES](#aws-ses)
* [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
* [Testing](#testing)
* [Build de producción](#build-de-producción)
* [Lint](#lint)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Arquitectura y decisiones técnicas](#arquitectura-y-decisiones-técnicas)
* [Flujo general de la aplicación](#flujo-general-de-la-aplicación)
* [Seguridad](#seguridad)
* [Flujo de envío de emails](#flujo-de-envío-de-emails)
* [Deploy](#deploy)
* [Uso de Inteligencia Artificial](#uso-de-inteligencia-artificial)
* [Estado actual](#estado-actual)
* [Próximas mejoras](#próximas-mejoras)
* [Scripts disponibles](#scripts-disponibles)
* [Autor](#autor)

---

## Funcionalidades

### Autenticación

Mitarea cuenta con un sistema de autenticación basado en Firebase Authentication.

Permite:

* Registro de nuevos usuarios mediante email y contraseña.
* Inicio de sesión mediante email y contraseña.
* Cierre de sesión.
* Persistencia de la sesión del usuario.
* Protección de la ruta principal de tareas.
* Redirección automática al login cuando un usuario no autenticado intenta acceder a una ruta protegida.
* Manejo de estados de carga durante la verificación de sesión.
* Manejo de errores durante el registro y el inicio de sesión.

Cada usuario autenticado accede únicamente a sus propias tareas.

---

### Gestión de tareas

La aplicación permite realizar un CRUD completo de tareas utilizando Cloud Firestore.

Las funcionalidades disponibles son:

* Crear nuevas tareas.
* Visualizar las tareas del usuario autenticado.
* Marcar tareas como completadas.
* Volver a marcar tareas completadas como pendientes.
* Editar el título y la descripción de una tarea.
* Eliminar tareas mediante confirmación.
* Persistir los datos en Cloud Firestore.
* Actualizar la interfaz en tiempo real mediante `onSnapshot`.
* Ordenar las tareas por fecha de creación, mostrando primero las más recientes.
* Validar títulos vacíos.
* Gestionar estados de carga y procesamiento.
* Gestionar errores durante las operaciones.
* Mostrar un contador de tareas.
* Interfaz responsive.

Las tareas se almacenan asociadas al `userId` del usuario autenticado. Las reglas de seguridad de Firestore restringen el acceso para que cada usuario pueda operar únicamente sobre sus propios documentos.

---

### Resumen por email

Mitarea permite enviar un resumen del estado actual de las tareas mediante un botón disponible en la interfaz.

El flujo utiliza:

* React en el frontend.
* Una función Serverless de Vercel.
* AWS SES para el envío del correo electrónico.

El frontend realiza una petición `POST` a `/api/send-email`.

La función Serverless valida la solicitud y utiliza AWS SES para enviar el resumen al destinatario.

Las credenciales privadas de AWS permanecen exclusivamente en variables de entorno del entorno Serverless y no se exponen en el código ejecutado en el navegador.

---

## Tecnologías utilizadas

### Frontend

* React 19.
* TypeScript.
* Vite.
* React Router DOM.
* CSS.

### Backend y servicios

* Firebase Authentication.
* Cloud Firestore.
* AWS SES.
* Vercel Serverless Functions.

### Testing y calidad

* Vitest.
* React Testing Library.
* JSDOM.
* ESLint.

### Herramientas de desarrollo

* Git.
* GitHub.
* Vercel.
* Firebase Console.
* AWS Console.

---

## Requisitos previos

Para ejecutar el proyecto localmente es necesario tener instalado:

* Node.js.
* npm.
* Git.

Además, se requiere disponer de:

* Un proyecto configurado en Firebase.
* Firebase Authentication habilitado.
* Cloud Firestore configurado.
* Una cuenta de AWS con acceso a Amazon SES.
* Un correo electrónico autorizado para utilizar AWS SES.
* Una cuenta de Vercel si se desea realizar el despliegue en producción.

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/nahuelcba22/ProyectoM4_NahuelCordoba
```

Ingresar a la carpeta del proyecto:

```bash
cd ProyectoM4_NahuelCordoba
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Configurar las variables de entorno necesarias antes de ejecutar la aplicación.

---

## Variables de entorno

Mitarea utiliza variables de entorno para configurar Firebase y los servicios privados utilizados por AWS SES.

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
```

### Firebase

Las variables que comienzan con `VITE_FIREBASE_` corresponden a la configuración del proyecto Firebase utilizado por la aplicación.

Firebase se utiliza para:

* Autenticación de usuarios.
* Almacenamiento de tareas en Cloud Firestore.
* Sincronización de tareas en tiempo real.

La configuración de Firebase se carga mediante variables de entorno en `src/services/firebase.ts`.

La configuración pública de Firebase utilizada por el frontend no debe confundirse con las credenciales privadas de AWS. Las credenciales de AWS nunca se utilizan directamente desde el navegador.

---

### AWS SES

Las variables relacionadas con AWS se utilizan exclusivamente en la función Serverless encargada del envío de emails.

Se utilizan:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
```

Las credenciales privadas de AWS nunca deben incluirse directamente en el código fuente ni subirse al repositorio.

El archivo `.env` debe permanecer fuera del control de versiones y estar incluido en `.gitignore`.

El archivo `.env.example` se incluye como plantilla y no contiene valores sensibles.

En producción, las variables necesarias se configuran como variables de entorno dentro de Vercel.

---

## Ejecutar en desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite iniciará la aplicación en modo desarrollo.

La aplicación estará disponible en la URL local indicada por Vite, normalmente:

```text
http://localhost:5173
```

Para probar el envío de emails localmente también es necesario tener correctamente configuradas las variables de entorno utilizadas por la función Serverless.

---

## Testing

El proyecto utiliza **Vitest** y **React Testing Library** para validar el comportamiento de la aplicación.

Actualmente cuenta con:

```text
Test Files  5 passed (5)
Tests       27 passed (27)
```

Los tests están distribuidos en cinco archivos y cubren las principales funcionalidades de la aplicación.

### ProtectedRoute

Se prueban:

* Estado de carga.
* Redirección de usuarios no autenticados.
* Acceso de usuarios autenticados.

### Login

Se prueban:

* Renderizado inicial.
* Validación de campos.
* Login exitoso.
* Manejo de errores.
* Estado de carga.

### Register

Se prueban:

* Renderizado inicial.
* Validación de campos.
* Registro exitoso.
* Manejo de errores.
* Estado de carga.

### Tasks

Se prueban:

* Estado sin tareas.
* Renderizado de tareas pendientes y completadas.
* Creación de tareas.
* Cambio de estado.
* Edición de tareas.
* Eliminación con confirmación.
* Envío exitoso del resumen por email.
* Manejo de errores del envío de email.

### API Serverless

Se prueban:

* Método HTTP no permitido.
* Falta de destinatario.
* Falta de tareas.
* Envío exitoso mediante AWS SES.
* Error de AWS SES.

Los servicios externos se mockean cuando corresponde para mantener los tests aislados y evitar dependencias de servicios reales durante la ejecución de las pruebas.

Para ejecutar todos los tests una sola vez:

```bash
npm test -- --run
```

Para ejecutar Vitest en modo interactivo:

```bash
npm test
```

---

## Build de producción

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

Este comando realiza la compilación del proyecto y genera una versión optimizada para producción.

El resultado se genera dentro de la carpeta:

```text
dist/
```

La carpeta `dist` contiene los archivos finales que Vite genera para que la aplicación pueda ser servida en producción, como:

* Archivos HTML.
* Archivos JavaScript compilados y optimizados.
* Archivos CSS.
* Recursos estáticos.

Es importante aclarar que `dist` **no contiene el código fuente original del proyecto**. Es una versión compilada y optimizada de la aplicación.

Normalmente, la carpeta `dist` no se sube al repositorio porque se genera automáticamente durante el proceso de build y despliegue.

Para realizar una previsualización local del build de producción:

```bash
npm run preview
```

El build de producción se encuentra funcionando correctamente.

---

## Lint

Para analizar el código mediante ESLint:

```bash
npm run lint
```

El proyecto utiliza ESLint para detectar problemas de calidad, errores potenciales y malas prácticas en el código.

La versión actual del proyecto pasa correctamente el análisis de ESLint sin errores ni advertencias.

---

## Estructura del proyecto

```text
.
├── api/
│   ├── send-email.ts
│   └── send-email.test.ts
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   └── ProtectedRoute.test.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── AuthContextObject.ts
│   │   └── useAuth.ts
│   │
│   ├── hooks/
│   │   └── useTasks.ts
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Login.test.tsx
│   │   ├── Register.tsx
│   │   ├── Register.test.tsx
│   │   ├── Tasks.tsx
│   │   └── Tasks.test.tsx
│   │
│   ├── services/
│   │   ├── firebase.ts
│   │   └── taskService.ts
│   │
│   ├── test/
│   │   └── setup.ts
│   │
│   ├── types/
│   │   └── task.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.node.json
```

### Descripción de las carpetas principales

**`api/`**

Contiene las funciones Serverless utilizadas por la aplicación.

Actualmente incluye la función encargada de procesar el envío del resumen de tareas mediante AWS SES.

---

**`components/`**

Contiene componentes reutilizables de la aplicación.

Actualmente incluye `ProtectedRoute`, encargado de restringir el acceso a las rutas protegidas.

---

**`context/`**

Contiene la gestión global de autenticación.

* `AuthContext.tsx`: proporciona el contexto y el estado de autenticación.
* `AuthContextObject.ts`: contiene la instancia y los tipos compartidos del contexto.
* `useAuth.ts`: hook utilizado para acceder al contexto de autenticación.

La separación permite mantener el componente `AuthProvider` independiente del hook consumidor y facilita el correcto funcionamiento de React Fast Refresh.

---

**`hooks/`**

Contiene lógica reutilizable de React.

`useTasks` centraliza la lógica relacionada con:

* Obtención de tareas.
* Suscripción a cambios en Firestore.
* Creación de tareas.
* Edición.
* Eliminación.
* Cambio de estado.
* Estados de carga y procesamiento.
* Manejo de errores.

---

**`pages/`**

Contiene las páginas principales de la aplicación:

* `Login`: inicio de sesión.
* `Register`: registro de usuarios.
* `Tasks`: gestión de tareas.

Las páginas principales cuentan con tests automatizados asociados.

---

**`services/`**

Contiene la lógica de comunicación con servicios externos.

* `firebase.ts`: inicialización de Firebase Authentication y Firestore.
* `taskService.ts`: operaciones CRUD y suscripción en tiempo real a las tareas.

---

**`types/`**

Contiene las definiciones de tipos utilizadas por TypeScript.

Actualmente incluye la interfaz `Task`, utilizada para representar las tareas de la aplicación.

---

**`test/`**

Contiene la configuración compartida utilizada por el entorno de pruebas.

---

**`public/`**

Contiene recursos públicos utilizados directamente por la aplicación.

Actualmente incluye el favicon.

---

## Arquitectura y decisiones técnicas

Mitarea utiliza una arquitectura orientada a separar la interfaz, la lógica de negocio y las integraciones con servicios externos.

### React + TypeScript

React se utiliza para construir una SPA modular mediante componentes reutilizables.

TypeScript permite definir estructuras de datos y contratos claros entre las diferentes partes de la aplicación, reduciendo errores y mejorando el mantenimiento del código.

---

### Context API para autenticación

El estado global de autenticación se gestiona mediante React Context.

Esto permite que los componentes puedan acceder al usuario autenticado y a las operaciones de registro, login y logout sin necesidad de pasar estas funciones mediante múltiples niveles de props.

---

### Custom Hooks

La lógica relacionada con la gestión de tareas se centraliza en `useTasks`.

De esta manera, las páginas se encargan principalmente de la presentación y de la interacción con el usuario, mientras que la lógica relacionada con las tareas se mantiene separada.

---

### Servicios

Las operaciones relacionadas con Firestore se mantienen en `taskService.ts`.

Esto permite desacoplar la lógica de acceso a datos de los componentes de interfaz y facilita su reutilización y testing.

---

### Funciones Serverless

El envío de emails se realiza mediante una función Serverless de Vercel.

Esta decisión permite mantener las credenciales privadas de AWS fuera del código que se ejecuta en el navegador.

---

### Tiempo real con Firestore

Las tareas se sincronizan mediante `onSnapshot`.

Esto permite que la interfaz reciba automáticamente las modificaciones realizadas sobre los documentos correspondientes al usuario autenticado.

---

## Flujo general de la aplicación

```text
Usuario
   │
   ├── Registro
   │      │
   │      ▼
   │   Firebase Authentication
   │
   ├── Inicio de sesión
   │      │
   │      ▼
   │   AuthContext
   │      │
   │      ▼
   │   ProtectedRoute
   │      │
   │      ▼
   │   Gestor de tareas
   │      │
   │      ▼
   │   useTasks
   │      │
   │      ▼
   │   taskService
   │      │
   │      ▼
   │   Cloud Firestore
   │
   └── Envío de resumen
          │
          ▼
       API Serverless
          │
          ▼
       AWS SES
          │
          ▼
     Correo electrónico
```

---

## Seguridad

Mitarea implementa diferentes medidas para proteger los datos de los usuarios y las credenciales de los servicios externos.

### Firestore

Las reglas de seguridad de Cloud Firestore restringen el acceso a las tareas según el usuario autenticado.

Cada documento contiene un `userId` y las reglas verifican que el usuario autenticado coincida con el propietario del documento.

La lógica implementada permite:

* Leer únicamente tareas propias.
* Crear tareas asociadas al usuario autenticado.
* Actualizar únicamente tareas propias.
* Eliminar únicamente tareas propias.

Las operaciones de actualización también verifican que el `userId` del documento no pueda ser modificado para transferir la propiedad de una tarea a otro usuario.

---

### Variables de entorno

Las variables sensibles utilizadas por AWS SES se mantienen en variables de entorno.

El archivo `.env` está excluido mediante `.gitignore`.

El archivo `.env.example` se utiliza como plantilla sin valores sensibles.

En producción, las variables se configuran mediante el entorno de Vercel.

---

### API Serverless

Las credenciales de AWS no se envían al frontend.

El frontend únicamente realiza una solicitud a:

```text
POST /api/send-email
```

La función Serverless utiliza las variables de entorno configuradas en Vercel para comunicarse con AWS SES.

---

## Flujo de envío de emails

El envío del resumen sigue el siguiente flujo:

```text
Usuario presiona "Enviar resumen"
             │
             ▼
       React / Tasks
             │
             │ POST /api/send-email
             │
             ▼
     Vercel Serverless Function
             │
             ├── Valida método HTTP
             ├── Valida destinatario
             ├── Valida lista de tareas
             │
             ▼
          AWS SES
             │
             ▼
     Correo electrónico
             │
             ▼
     Respuesta al frontend
             │
             ├── Éxito
             └── Error
```

La función Serverless devuelve diferentes respuestas según el resultado de la operación:

* `200`: email enviado correctamente.
* `400`: faltan datos necesarios.
* `405`: método HTTP no permitido.
* `500`: error durante el envío mediante AWS SES.

La interfaz muestra al usuario el estado correspondiente de la operación.

---

## Deploy

La aplicación se encuentra desplegada en producción mediante Vercel.

**URL de producción:**

https://proyecto-m4-nahuel-cordoba.vercel.app/login

El entorno de producción utiliza variables de entorno configuradas directamente en Vercel.

Las principales funcionalidades verificadas en producción son:

* Registro.
* Login.
* Logout.
* Protección de rutas.
* CRUD de tareas.
* Persistencia en Firestore.
* Sincronización en tiempo real.
* Ordenamiento de tareas por fecha de creación.
* Cambio entre tareas pendientes y completadas.
* Edición de tareas.
* Eliminación de tareas.
* Envío de resumen mediante AWS SES.

---

## Uso de Inteligencia Artificial

La Inteligencia Artificial fue utilizada como herramienta de apoyo durante el proceso de desarrollo del proyecto.

El objetivo no fue delegar completamente la implementación, sino utilizar IA como asistente para analizar problemas, explorar alternativas y mejorar la calidad del código, manteniendo la comprensión del funcionamiento de cada parte implementada.

Entre los principales usos se encuentran:

* Análisis y revisión de la arquitectura del proyecto.
* Exploración de buenas prácticas para React y TypeScript.
* Revisión de la separación entre componentes, hooks y servicios.
* Análisis de reglas de seguridad de Firestore.
* Revisión del manejo de variables de entorno.
* Generación y mejora de tests unitarios y de componentes.
* Análisis de errores detectados por ESLint.
* Revisión de posibles problemas de tipado.
* Revisión de la configuración de Vercel y las funciones Serverless.
* Análisis de posibles mejoras en la estructura del proyecto.
* Revisión de la documentación.

Un patrón de uso importante consistió en utilizar la IA para analizar problemas concretos y posteriormente verificar las propuestas mediante documentación oficial, ejecución de tests, build y pruebas manuales de la aplicación.

También se utilizó IA para generar propuestas iniciales de tests y posteriormente validar que dichos tests realmente comprobaran el comportamiento esperado de la aplicación.

Este proceso permitió identificar y corregir problemas relacionados con:

* Uso innecesario de `any`.
* Organización del contexto de autenticación.
* Reglas de ESLint.
* Gestión de estados en hooks.
* Cobertura de testing.
* Manejo de mocks.
* Separación de responsabilidades.

La utilización de IA se realizó priorizando la comprensión del código generado o modificado y la validación posterior mediante herramientas de desarrollo.

---

## Estado actual

Mitarea se encuentra actualmente en una versión funcional y desplegada en producción.

Las principales características implementadas son:

* Autenticación mediante Firebase.
* Registro de usuarios.
* Inicio de sesión.
* Logout.
* Protección de rutas.
* Persistencia de sesión.
* CRUD completo de tareas.
* Persistencia en Cloud Firestore.
* Filtrado de tareas por usuario autenticado.
* Sincronización en tiempo real.
* Ordenamiento por fecha de creación.
* Cambio entre tareas pendientes y completadas.
* Edición de tareas.
* Eliminación con confirmación.
* Validaciones básicas.
* Manejo de estados de carga.
* Manejo de errores.
* Envío de resumen por email.
* Integración con AWS SES.
* Función Serverless en Vercel.
* Variables de entorno configuradas correctamente.
* Reglas de seguridad de Firestore implementadas.
* 27 tests automatizados pasando correctamente.
* ESLint sin errores ni advertencias.
* Build de producción funcionando correctamente.
* Deploy público en Vercel.
* Interfaz responsive.
* Pruebas manuales de las funcionalidades principales realizadas correctamente.

---

## Próximas mejoras

Aunque la versión actual cumple con las funcionalidades principales del proyecto, existen posibles mejoras que podrían implementarse posteriormente:

* Rediseño visual general de la interfaz.
* Mejora de la experiencia de usuario en dispositivos móviles.
* Mejora de la jerarquía visual.
* Mejora de los estados visuales de las tareas.
* Mejora de los formularios de autenticación.
* Incorporación de autenticación mediante Google.
* Mejora del diseño visual del email.
* Incorporación de una presentación HTML más completa para los resúmenes.
* Implementación de filtros para tareas pendientes, completadas y todas.
* Incorporación de fechas de vencimiento.
* Ordenamiento por prioridad.
* Implementación de drag & drop para reordenar tareas.
* Mejora de la accesibilidad.
* Ampliación de la cobertura de tests.
* Optimización del bundle de producción.

Las futuras modificaciones visuales o funcionales podrán desarrollarse mediante ramas o commits separados para mantener una versión estable y facilitar la comparación entre diferentes iteraciones del proyecto.

---

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo de Vite.

### Build

```bash
npm run build
```

Compila el proyecto y genera los archivos optimizados de producción en la carpeta `dist`.

### Preview

```bash
npm run preview
```

Previsualiza localmente el build de producción generado.

### Lint

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

### Tests

```bash
npm test
```

Ejecuta Vitest en modo interactivo.

Para ejecutar todos los tests una sola vez:

```bash
npm test -- --run
```

---

## Autor

**Nahuel Córdoba**

GitHub: https://github.com/nahuelcba22

LinkedIn: https://www.linkedin.com/in/nahuelcba02
