<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This repository is node API using NestJs for a simple application that manager laboratoies and exams.
It includes endpoints to atend follow situations:

  - Laboratory:
    - Create new laboratory;
    - Get a list of actives laboratories;
    - Update a laboratory;
    - Remove logicaly an active laboratory;
  - Exams:
    - Create new Exam;
    - Get a list of actives exams;
    - Update an exam;
    - Remove logicaly an active laboratory;
  - Links
    - Link an active exam to an active laboratory;
    - Unlink an active exam to an active laboratory;
  
  Important informations:
   - An exam can be linked to more than one laboratory;
   - When a laboratory or exam is created, their are consider actives and receive an 'ID' that is automaticaly generated

  Entities:
   - Laboratory
     - name
     - address
     - status [active, incative]
   - Exam
     - name
     - type [clinical analysis, image]
     - status [active, incative]

  Extra functionalities:
   - Possibility to perform registration, update and removal in batch;
   - Endpoint which searches by exam name and returns all labs associated with that exam.

Observations:
 - Address was defined as a plain text to simplify the solution, but can be improved by using a separate table and entity.

## Documentation
The documentation can be found at /docs by 
[swagger](https://wa-laboratory.herokuapp.com/docs/).

## Database
 - Was used an postgres database with follow ER model:

 ![ER model](https://raw.githubusercontent.com/DavidMoura07/wa-laboratorio-api/master/Documentation/images/ER%20Model.png)
 
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker usage

```bash
# docker-compose
$ docker-compose up
```

