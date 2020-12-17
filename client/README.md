![CI Frontend Pipeline](https://github.com/DPigeon/Money-Tree/workflows/CI%20Frontend%20Pipeline/badge.svg)
</br>
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=money-tree_FRONTEND)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)
</br>
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=money-tree_FRONTEND&metric=bugs)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=money-tree_FRONTEND&metric=coverage)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=money-tree_FRONTEND&metric=ncloc)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=money-tree_FRONTEND&metric=sqale_index)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=money-tree_FRONTEND&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=money-tree_FRONTEND)


<!-- ABOUT -->
## About
This folder contains the Client part of the project. It makes request to the backend only. This is where the frontend part of the project resides.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.


### Built With
* npm
* Typescript
* Angular


<!-- GETTING STARTED -->
## Getting Started

Follow these steps to get a working version of our application

### Prerequisites

**Make sure you also have the prerequisites from the root folder **

if not using docker, need below

* npm
* angular-cli
* Typescript

### Installation

1. Clone the repo
```sh
git clone https://github.com/DPigeon/Money-Tree.git
```
2. A. Run the Docker Container (from the client folder of the project)
```sh
docker-compose up
```

OR

2. B. Alternatively to 2A, you can run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


<!-- USAGE EXAMPLES -->
## Usage

* The client is running on port 80 at http://localhost:80/


## FAQ And Special Configurations

### How to run sonarscanner locally
The sonarscanner is ran in our workflows, but you might want to run it locally if you want to run it multiple times and verify stuff which will speed up the process.

1. Download the scanner [here](https://sonarcloud.io/project/configuration?analysisMode=GitHubManual&id=money-tree_FRONTEND) (click on Other)
2. Run the scanner in client folder

`sonar-scanner -Dsonar.branch.name=$branch_name`

***IMPORTANT:*** You need to specify the branch when you're running the scan otherwise it will send the results to the default branch (dev)


### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `npm run test` to execute the unit tests via [Jest].
Run `npm run test -- --coverage` to execute the unit tests and generate a testing report

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
