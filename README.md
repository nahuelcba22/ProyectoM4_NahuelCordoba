# TaskFlow

Aplicación web de gestión de tareas desarrollada como proyecto educativo. Permite a los usuarios registrarse, iniciar sesión y administrar sus tareas personales mediante operaciones de creación, consulta, edición, actualización de estado y eliminación.

La aplicación también cuenta con un sistema de resumen de tareas mediante envío de correos electrónicos.

(…) Agregar una descripción breve de la motivación del proyecto y del objetivo principal del Proyecto M4.

---

## Índice

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
* [Ejecutar los tests](#ejecutar-los-tests)
* [Verificar el build de producción](#verificar-el-build-de-producción)
* [Lint](#lint)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Flujo general de la aplicación](#flujo-general-de-la-aplicación)
* [Operaciones de tareas](#operaciones-de-tareas)
* [Estado actual](#estado-actual)
* [Próximas mejoras](#próximas-mejoras)
* [Scripts disponibles](#scripts-disponibles)
* [Autor](#autor)

---

## Funcionalidades

### Autenticación

* Registro de nuevos usuarios.
* Inicio de sesión.
* Cierre de sesión.
* Protección de la ruta principal de tareas.
* Acceso a las tareas asociadas al usuario autenticado.

(…) Evaluar la incorporación de autenticación mediante Google u otro proveedor OAuth de Firebase.

### Gestión de tareas

* Crear nuevas tareas.
* Visualizar las tareas del usuario autenticado.
* Marcar tareas como completadas.
* Marcar tareas completadas nuevamente como pendientes.
* Editar el título de una tarea.
* Eliminar tareas con confirmación.
* Actualización de tareas en tiempo real mediante Firestore.
* Validación de títulos vacíos.
* Manejo de estados de carga durante las operaciones.
* Manejo de errores durante las operaciones con las tareas.

(…) Revisar y definir el orden en el que se muestran las tareas. Actualmente las tareas se reciben desde Firestore sin un orden explícito.

(…) Posible implementación de ordenamiento por fecha de creación, mostrando las tareas más recientes primero.

### Resumen por email

* Envío de un resumen de las tareas actuales del usuario.
* Integración con AWS SES.
* La funcionalidad de envío se gestiona mediante una API Serverless.

(…) Mejorar el diseño visual del correo electrónico.

(…) Evaluar la incorporación de una estructura más completa para el email, incluyendo una presentación más atractiva de las tareas y posibles elementos visuales.

---

## Tecnologías utilizadas

### Frontend

* React 19
* TypeScript
* Vite
* React Router DOM
* CSS

### Backend y servicios

* Firebase Authentication
* Firebase Firestore
* AWS SES
* Vercel Serverless Functions

### Testing y calidad

* Vitest
* Testing Library
* JSDOM
* ESLint

(…) Evaluar la incorporación de más pruebas automatizadas para cubrir las funcionalidades principales de la aplicación.

---

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

* Node.js
* npm
* Una cuenta y un proyecto configurado en Firebase.
* Una cuenta de AWS con acceso a Amazon SES para el envío de emails.
* Una cuenta de Vercel si se desea desplegar la aplicación y utilizar la función Serverless de envío de emails.

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

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Las variables necesarias son:

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

Las variables que comienzan con `VITE_FIREBASE_` corresponden a la configuración del proyecto de Firebase utilizado por la aplicación.

Firebase se utiliza principalmente para:

* Autenticación de usuarios.
* Almacenamiento de tareas en Firestore.
* Sincronización de las tareas en tiempo real.

### AWS SES

Las variables relacionadas con AWS se utilizan para enviar el resumen de tareas por correo electrónico mediante Amazon SES.

Por seguridad, las credenciales privadas de AWS no deben exponerse en el código del frontend ni subirse al repositorio.

El archivo `.env` debe mantenerse fuera del control de versiones.

---

## Ejecutar en desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite iniciará la aplicación en modo desarrollo.

---

## Ejecutar los tests

Para ejecutar los tests:

```bash
npm test
```

Para ejecutar los tests una sola vez:

```bash
npm test -- --run
```

Actualmente, el proyecto cuenta con pruebas automatizadas para el componente `ProtectedRoute`.

(…) Ampliar la cobertura de tests para las funcionalidades principales de gestión de tareas y autenticación.

---

## Verificar el build de producción

Para comprobar que el proyecto compila correctamente:

```bash
npm run build
```

Este comando ejecuta:

1. La compilación y verificación de TypeScript.
2. El proceso de build de Vite.

Los archivos optimizados para producción se generan dentro de la carpeta `dist`.

La carpeta `dist` contiene la versión compilada y optimizada de la aplicación que se utilizará para producción. No corresponde a archivos originales del proyecto ni a recursos del template de Vite.

Si dentro de `dist` aparecen archivos con nombres generados o recursos gráficos, forman parte del resultado de compilación de la aplicación.

También es posible ejecutar una previsualización local del build:

```bash
npm run preview
```

(…) Revisar el warning actual de Vite relacionado con el tamaño del bundle generado, aunque actualmente no impide que el build se complete correctamente.

---

## Lint

Para analizar el código con ESLint:

```bash
npm run lint
```

(…) Ejecutar y verificar ESLint antes de considerar finalizada la versión actual del proyecto.

(…) Corregir cualquier warning o error que pueda aparecer.

---

## Estructura del proyecto

```text
.
├── api/
│   └── send-email.ts
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
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/
│   │   └── useTasks.ts
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Tasks.tsx
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

**`components/`**

Contiene componentes reutilizables de la aplicación.

Actualmente incluye `ProtectedRoute`, encargado de restringir el acceso a las rutas protegidas.

**`context/`**

Contiene el contexto global de autenticación y permite acceder al usuario autenticado y a las funciones relacionadas con la sesión.

**`hooks/`**

Contiene lógica reutilizable de React.

`useTasks` centraliza las operaciones relacionadas con la gestión de tareas y la comunicación con el servicio de tareas.

**`pages/`**

Contiene las páginas principales de la aplicación:

* `Login`: inicio de sesión.
* `Register`: registro de usuarios.
* `Tasks`: gestión de tareas.

**`services/`**

Contiene la lógica de comunicación con servicios externos.

* `firebase.ts`: configuración e inicialización de Firebase.
* `taskService.ts`: operaciones relacionadas con las tareas en Firestore.

**`types/`**

Contiene las definiciones de tipos utilizadas por TypeScript.

**`test/`**

Contiene la configuración utilizada por el entorno de pruebas.

**`public/`**

Contiene recursos públicos utilizados directamente por la aplicación.

Actualmente incluye el favicon de la aplicación.

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
   │   Ruta protegida
   │      │
   │      ▼
   │   Gestor de tareas
   │      │
   │      ▼
   │   Firebase Firestore
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

(…) Evaluar la incorporación de autenticación mediante Google utilizando Firebase Authentication y un flujo OAuth.

(…) Revisar y mejorar el sistema de envío de resumen por email.

---

## Operaciones de tareas

Las tareas pertenecen al usuario autenticado y se almacenan en Firebase Firestore.

La aplicación permite realizar las siguientes operaciones:

| Operación         | Descripción                                   |
| ----------------- | --------------------------------------------- |
| Crear             | Crea una nueva tarea asociada al usuario      |
| Leer              | Obtiene las tareas del usuario en tiempo real |
| Actualizar estado | Cambia entre completada y pendiente           |
| Editar            | Modifica el título de una tarea               |
| Eliminar          | Elimina una tarea después de una confirmación |

---

## Estado actual

La aplicación se encuentra actualmente en una versión funcional con las principales características implementadas:

* Autenticación de usuarios.
* Rutas protegidas.
* CRUD completo de tareas.
* Actualización de tareas en tiempo real.
* Cambio de estado entre completado y pendiente.
* Edición de tareas.
* Eliminación de tareas con confirmación.
* Envío de resumen por email.
* Validaciones básicas.
* Manejo de estados de carga.
* Manejo de errores.
* Tests automatizados.
* Build de producción funcionando correctamente.

La aplicación cuenta actualmente con una interfaz funcional y responsive.

El funcionamiento técnico principal se encuentra implementado y operativo.

---

## Próximas mejoras

Una vez finalizada y verificada la versión funcional actual, se contempla realizar una segunda etapa enfocada principalmente en la experiencia de usuario y la presentación visual.

Posibles mejoras:

* Rediseño general de la interfaz.
* Mejora de la experiencia responsive en dispositivos móviles.
* Revisión de la jerarquía visual y distribución de los elementos.
* Mejora de los estados visuales de las tareas.
* Mejora de los formularios de autenticación.
* Incorporación de autenticación mediante Google.
* Revisión y mejora del diseño del email enviado.
* Implementación de un orden explícito para las tareas.
* Posible ordenamiento por fecha de creación.
* Mejora de la accesibilidad.
* Ampliación de la cobertura de tests.
* Revisión del bundle de producción y posible optimización del código.
* (…) Evaluar la incorporación de nuevas funcionalidades según las necesidades del proyecto.

(…) El rediseño visual se realizará sobre una rama o commit separado, permitiendo comparar la nueva versión con la versión funcional actual y conservar la posibilidad de volver al diseño anterior si el resultado no es satisfactorio.

---

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo.

### Build

```bash
npm run build
```

Compila TypeScript y genera el build de producción mediante Vite.

### Preview

```bash
npm run preview
```

Previsualiza localmente el build de producción.

### Lint

```bash
npm run lint
```

Ejecuta ESLint para analizar el código.

(…) Verificar que el script funcione correctamente y resolver cualquier warning o error detectado.

### Tests

```bash
npm test
```

Ejecuta Vitest en modo interactivo.

Para ejecutar los tests una sola vez:

```bash
npm test -- --run
```

---

## Autor

**Nahuel Córdoba**

(…) Agregar enlaces al perfil de GitHub y, si corresponde, LinkedIn o portfolio.

---
