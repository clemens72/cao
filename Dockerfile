# Use Node.js as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Database
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD npm run dev

#RUN npx prisma migrate dev --name init
# docker exec -it my_container sh -c "npx prisma migrate dev --name init"

#RUN npx prisma db seed
# docker exec -it my_container sh -c "npx prisma db seed"