# Pull the base image
FROM oven/bun:latest

# Set the working directory
ENV WORKDIR=/workdir
WORKDIR $WORKDIR

# Copy package.json file.
COPY ./package.json .

# Install dependencies.
RUN bun install

# Copy rest of the files to the working directory.
COPY . .
