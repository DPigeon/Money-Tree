# Backend Build
FROM adoptopenjdk/maven-openjdk11 as maven
# Define the env config arg
ARG ENVCONFIGBACKEND
# User maven has write access
WORKDIR /home/maven
# Copy packages files
COPY pom.xml ./
# Copy source files from backend
COPY src/ ./src
# Install package dependencies
RUN mvn dependency:go-offline -B
# Build backend
RUN mvn package -Dmaven.test.skip=true ${ENVCONFIGBACKEND}
# Get ready to create .jar to run
FROM adoptopenjdk:11-jre-hotspot
# Create jar folder and change current directory
RUN mkdir jar
# Copy jar file generated
COPY --from=maven /home/maven/target/moneytree-*.jar /home/maven/jar/moneytree.jar
# Execute command once image started
CMD ["java", "-jar", "/home/maven/jar/moneytree.jar"]