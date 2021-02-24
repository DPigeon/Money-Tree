![CI Backend Pipeline](https://github.com/DPigeon/Money-Tree/workflows/CI%20Backend%20Pipeline/badge.svg)
</br>
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=money-tree_BACKEND)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)
</br>
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=money-tree_BACKEND&metric=bugs)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=money-tree_BACKEND&metric=coverage)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=money-tree_BACKEND&metric=ncloc)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=money-tree_BACKEND&metric=sqale_index)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=money-tree_BACKEND&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=money-tree_BACKEND)


<!-- ABOUT -->
## About
This folder contains the API part of the project. It is where the client makes request. The business logic resides here.


### Built With
* Maven
* Java
* Springboot


<!-- GETTING STARTED -->
## Getting Started

Follow these steps to get a working version of our application

### Prerequisites

**Make sure you also have the prerequisites from the root folder **

* Maven
* Java 11

### Installation

1. Clone the repo
```sh
git clone https://github.com/DPigeon/Money-Tree.git
```
2. Get the secrets from the slack #secret-sharing and store them in your environment

3. A. Run the Docker Container (from the backend folder of the project)
```sh
docker compose up
```

OR

3. B. Alternatively to 3A, you can run the springboot application on its own:
`mvn clean verify spring-boot:run`

Note that for 3B, an instance of the neo4j database needs to be running beforehand, either by downloading it on their website or using the docker image

<!-- USAGE EXAMPLES -->
## Usage

* The backend is running on port 8080
* Neo4j Database is running on port 7687(bolt) and the browser 7474(http)

You can make api requests to http://localhost:8080/

You can access the DB GUI with the following link [http://localhost:7474/](http://localhost:7474/)


IMPORTANT NOTE: The first time the neo4j database runs, the user/pwd is neo4j and needs to be changed according to our the env variables

## Testing


* Unit test files follow this pattern `*Test.groovy`
* Integration test file follow this pattern `*IT.groovy`

* To run unit test:
`mvn clean test`

* To run integration test
`mvn failsafe:integration-test`

When executing `mvn verify` both unit and integration tests will be executed after the packaging phase of the jar
When executing `mvn clean install` both unit and integration tests will be executed after the packaging phase of the jar

## API Reference and Docs
The Swagger UI page is available at http://server:port/context-path/swagger-ui.html

[DEV QUICKLINK](http://money-tree.tech:8080/api/v1/swagger-ui.html)

</br>

The OpenAPI description is available at the following url for json format: http://server:port/context-path/v3/api-docs

[DEV QUICKLINK](http://money-tree.tech:8080/api/v1/v3/api-docs)


More info here: 
https://springdoc.org/

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[ci-shield]: https://github.com/DPigeon/Money-Tree/workflows/CI%20Pipeline/badge.svg
[ci-url]: https://github.com/DPigeon/Money-Tree/actions

## FAQ And Special Configurations

### How to run sonarscanner locally
The sonarscanner is ran in our workflows, but you might want to run it locally if you want to run it multiple times and verify stuff which will speed up the process.

`mvn verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar -Dsonar.branch.name=$branch_name`

***IMPORTANT:*** You need to specify the branch when you're running the scan otherwise it will send the results to the default branch (dev)
