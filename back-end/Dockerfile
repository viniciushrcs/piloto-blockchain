# Use a multi-stage build
FROM node:16 as build

# Set the working directory
WORKDIR /app/src

# Copy package.json and install dependencies
COPY src/package.json .
RUN npm install

# Copy TypeScript source files
COPY src .

# Build the TypeScript project
RUN npm run build

# Start a new stage for the production image
FROM ubuntu

RUN apt-get update && apt-get install -y curl

# Install node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y nodejs


WORKDIR /app

# Install kubectl
RUN apt-get update && apt-get install -y apt-transport-https gnupg2
RUN curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list
RUN apt-get update && apt-get install -y kubectl

# Install kind
RUN curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-linux-amd64
RUN chmod +x ./kind
RUN mv ./kind /usr/local/bin/kind

# Install Docker
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
RUN curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable"
RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io


# Install envsubst
RUN apt-get update && apt-get install -y gettext-base

# Install JQ
RUN apt-get update && apt-get install -y jq

# Copy the build output from the build stage
COPY --from=build /app/src/dist /app/src
COPY --from=build /app/src/node_modules /app/src/node_modules
COPY --from=build /app/src/yaml-templates /app/src/yaml-templates

# Set the working directory
WORKDIR /app/src

COPY ./network ../
COPY scripts ../scripts
COPY bin /usr/local/bin
COPY chaincode-typescript ../chaincode-typescript

# Define the volume mapping
#VOLUME [ "/app/config", "/app/kube", "/app/build", "/.kube" ]
VOLUME [ "/app/config", "/app/kube", "/.kube" ]

# Expose port 3000
EXPOSE 3000

# Set the entrypoint for the container
ENTRYPOINT ["node", "main.js"]
