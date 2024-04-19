# Pull the base image
FROM oven/bun:latest

# Set the working directory
ENV WORKDIR /app
WORKDIR $WORKDIR

# Copy package.json file.
COPY ./package.json .

# Install dependencies.
RUN bun install

# Copy the current directory contents into the container at /app
COPY . .
