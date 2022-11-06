# OC - P7 - API

This repository contains the API code for the P7.
You can find the frontend here:
https://github.com/JulienLavocat/OC_P7_Api

## Stack

-   NestJS
-   Prisma (ORM)
-   Postgres (Database)

## Setup using Docker and Docker compose

-   Clone the project: `git clone https://github.com/JulienLavocat/OC_P7_API`
-   Install dependencies: `yarn` (or use NPM if you want)
-   Init required services: `docker compose up -d`
-   Init the database: `yarn prisma migrate deploy`
-   Run the project: `yarn start`

Note:

-   The first registered user is the admin account
-   A default .env is available in the repository in order to ease the setup, it only specifies
    local credentials

## Setup without Docker and Docker compose

-   Clone the project: `git clone https://github.com/JulienLavocat/OC_P7_API`
-   Install dependencies: `yarn` (or use NPM if you want)
-   Install PostgreSQL
-   Create a database and populates your .env with your databases connection string accordingly
-   initialize the database using `yarn prisma migrate deploy`
-   Run the project: `yarn start`

Note:

-   The first registered user is the admin account
