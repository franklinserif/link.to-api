<!-- prettier-ignore -->
# Linkto API

Esta es una API RESTful construida con [NestJS](https://nestjs.com/) que se encarga de acortar enlaces. La aplicación incluye un sistema de autenticación y está dockerizada para facilitar su despliegue y desarrollo.

![ci-test](https://github.com/franklinsrr/link.to-api/actions/workflows/ci-test.yml/badge.svg)

## Características

- Acortamiento de enlaces.
- Sistema de autenticación de usuarios.
- Uso de tokens JWT para autenticación.
- Dockerizado para fácil despliegue.
- Base de datos PostgreSQL.
- Uso de Docker Compose para gestionar los servicios.

## Tecnologías

- **NestJS**: Framework de Node.js para construir aplicaciones escalables.
- **PostgreSQL**: Base de datos relacional.
- **Docker**: Para contenerización de la aplicación.
- **Docker Compose**: Para orquestar los servicios de base de datos y la aplicación.
- **Passport**: Middleware de autenticación.

## Prerrequisitos

Asegúrate de tener instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/franklinsrr/link.to-api.git
   cd tu-repositorio
   ```

2. Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables:

   ```bash
   NODE_ENV=production
   DATABASE_NAME=nombre_de_tu_base_de_datos
   DATABASE_USER=usuario_de_tu_base_de_datos
   DATABASE_USER_PASSWORD=contraseña_de_tu_base_de_datos
   PASSPORT_SECRET=tu_secreto_de_passport
   PORT=3000
   ```

3. Levanta los servicios con Docker Compose:
   ```bash
   docker-compose up --build
   ```
   Esto creará y levantará los contenedores tanto para la base de datos como para la aplicación NestJS.

## Estructura del Proyecto

- nestjs-app: Contiene el código fuente de la API de acortamiento de enlaces.
- postgres-db: Servicio de PostgreSQL, utilizado como la base de datos de la aplicación.

## Documentación de la API con Swagger

Esta API incluye una documentación interactiva generada con [Swagger](https://swagger.io/), donde puedes ver todos los endpoints disponibles junto con sus esquemas.

### Acceso a Swagger

Una vez que los contenedores estén corriendo, puedes acceder a la documentación de Swagger en el path: **_/api_**
