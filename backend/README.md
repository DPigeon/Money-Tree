# How to run locally

## JAVA

You need java 11 to run the application. You can check you java version by running this command in your terminal: `java -version`.

## MAVEN
There is a maven executable for unix-base dos in the backend repo called mvnw. To execute it, run `./mvnw <comands>`

- Maven is a dependency manager for java project. Using the cli commands, you can import dependency, build project, run test . . .

- To import all dependency and create the jar files and run the tests, run `./mvnw clean install`

- To import all dependency and create jar file without running tests, run `./mvnw/ clean install -DskipTests`

- To run only the tests run `./mvnw clean test`

## Neo4j
You need to install neo4j in your OS of choice. For macOS users, you can use brew by running `brew install neo4j` in your terminal.

- You can use a GUI to look at your local neo4j instance using neo4j desktop (https://neo4j.com/download-neo4j-now/).

- When you first start neo4j, the default username and password is neo4j (for both). neo4j will not allow any application
to connect if the password has not been changed.

- To start neo4j locally, open your terminal and run `neo4j start`

- If neo4j is up and running locally, you can run `curl -v -u neo4j:neo4j -X POST localhost:7474/user/neo4j/password -H "Content-type:application/json" -d "{\"password\":\"stonecap\"}"` to change the default password to stonecap. This our db password for dev when running the application locally.
If this does not work, you can go through the browser at localhost:7474 and change the password from there.

## Springboot App

To run the application locally you can run `mvn spring-boot:run` or run it from your ide directly (I suggest Intellij IDEA).

### Steps

1. download neo4j and change the default password to stonecap

2. deploy neo4j locally

3. run `./mvnw clean install` to get all dependencies locally and run tests

4. run `mvn spring-boot:run` to start the application (listening in port 8080 by default)

### Testing

1. To run tests, run this command `./mvnw clean test`

2. Report will be generated in /target/spock-reports folder
