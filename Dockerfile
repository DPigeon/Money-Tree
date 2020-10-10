# Client Build
FROM trion/ng-cli as ng
# User node has write access
WORKDIR /home/node
# Copy packages files
COPY client/package*.json ./
# Install dependencies
RUN npm ci
# Copy everything else in client
COPY client/ ./
# Build frontend in production mode
RUN ng build --prod
# Get nginx to host on production
FROM nginx:1.15.8-alpine
# Copy dist to nginx
COPY --from=ng /home/node/dist/client/ /usr/share/nginx/html

# Backend Build
FROM adoptopenjdk/maven-openjdk11 as maven
# User maven has write access
WORKDIR /home/maven
# Copy packages files
COPY backend/pom.xml ./
# Copy source files from backend
COPY backend/src/ ./src
# Install package dependencies
RUN mvn dependency:go-offline -B
# Build backend
RUN mvn package -Dmaven.test.skip=true
# Get ready to create .jar to run
FROM adoptopenjdk:11-jre-hotspot
# Create jar folder and change current directory
RUN mkdir jar
# Copy jar file generated 
COPY --from=maven /home/maven/target/moneytree-*.jar /home/maven/jar/moneytree.jar
# Execute command once image started
CMD ["java", "-jar", "/home/maven/jar/moneytree.jar"]

# Exposing the client ports
EXPOSE 4200
EXPOSE 80
# Exposing the backend port
EXPOSE 8080