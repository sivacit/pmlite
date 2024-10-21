# Use the official node image as the base image
FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Copy the rest of the code
COPY . .

# Install dependencies
RUN corepack enable && pnpm install

# Build the NestJS application
RUN pnpm build

# Expose the port on which your NestJS app will run
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
