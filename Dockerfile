# Use a Node.js Alpine-based image for the development stage
FROM node:18-alpine

WORKDIR /usr/app

COPY package.json package-lock.json .env ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# Define the command to start the application
CMD ["npm", "run", "start:dev"]