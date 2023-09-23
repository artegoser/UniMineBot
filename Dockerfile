FROM node:18-alpine as run
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD npm run start
EXPOSE 80
