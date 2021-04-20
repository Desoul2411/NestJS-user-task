FROM node:14-alpine
WORKDIR /app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run test
RUN npm run test:e2e
CMD ["node","./dist/main.js"]
