FROM node:21.7.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to WORKDIR
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to WORKDIR
COPY . .

# Build the React app
RUN npm run build

# Set the command to run the app
CMD ["npm", "start"]
