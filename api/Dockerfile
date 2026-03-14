# builder
FROM node:18 as builder

WORKDIR /app

COPY api/package*.json ./api/
WORKDIR /app/api

RUN npm install

WORKDIR /app
COPY . .

WORKDIR /app/api
RUN npm run build

# production
FROM node:18 as production

WORKDIR /app

COPY api/package*.json ./

RUN sed -i 's/node dist\/main/node dist\/api\/src\/main/' package.json

RUN npm install --only=production

COPY --from=builder /app/api/dist /app/dist

CMD ["npm", "run", "start:prod"]
