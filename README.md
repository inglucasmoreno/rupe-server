

### EQUINOCCIO - DESARROLLOS
- Version de Node v18.16.0 (NPM v9.5.1)
- Base de datos MySQL

## Instalación

```bash
$ yarn install
```

## Configurar variables de entorno
- Crear archivo .env en funcion del template .env.template

## Docker compose
```bash
$ docker compose up -d
```

## ORM Prisma - Migracion inicial
```bash
$ yarn prisma migrate dev --name inicializacion
```

## Correr la aplicación

```bash
# Desarrollo
$ yarn start

# Modo seguimiento
$ yarn start:dev

# Modo produccion
$ yarn start:prod
```

## Desarrollado por

- Author - Ing. Moreno Lucas Omar
- Linkedin - [Comunicate conmigo!](https://www.linkedin.com/in/lucas-omar-moreno-16246678)
