# Use the official Bun image as the base image
FROM oven/bun:1

# Set the working directory inside the container
WORKDIR /app

# Install necessary tools && cleaning up unnecessary files
RUN apt-get update && apt-get install -y redis-tools \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and bun.lockb to install dependencies
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

COPY ../.env.docker .env
RUN chmod 644 .env

# Copy the startup script
COPY .docker/init.sh /init.sh
RUN chmod +x /init.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD [ "sh", "/init.sh" ]
