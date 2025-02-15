FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:8000

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"] 