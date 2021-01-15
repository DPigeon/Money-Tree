# Client Build
FROM trion/ng-cli as ng
# Define the env config arg
ARG ENVCONFIG
# User node has write access
WORKDIR /home/node
# Copy packages files
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy everything else in client
COPY ./ ./
# Build frontend in production mode
RUN ng build ${ENVCONFIG}
# Get nginx to host on production
FROM nginx:1.17-alpine
# Redefine env config for multi-stage
ARG ENVCONFIG
# Copy the nginx config to nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy dist to nginx
COPY --from=ng /home/node/dist/client/ /usr/share/nginx/html
# COPY certificates to image
COPY ./certs ./certs
# Take the proper certificate for the environment
COPY certEnv.sh ./
# Run certificate script
RUN chmod +x certEnv.sh
RUN apk update
RUN apk upgrade
RUN apk add bash
RUN ./certEnv.sh ${ENVCONFIG}
# Start nginx
CMD ["nginx", "-g", "daemon off;"]