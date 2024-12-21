FROM node:20 as build

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]