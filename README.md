# OC - P7 - API

This repository contains the API code for the P7.

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

Note: The first registered user is the admin account
