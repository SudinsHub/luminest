FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create upload folders inside the container
RUN mkdir -p uploads/products uploads/categories uploads/carousel

EXPOSE 5000

CMD ["npm", "start"]