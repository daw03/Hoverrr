FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g serve
RUN npm install
RUN npm run build

EXPOSE 80

CMD ["serve", "-s", "dist"]
 