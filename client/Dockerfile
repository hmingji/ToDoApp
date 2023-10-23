FROM node:18-alpine AS builder
ENV NODE_ENV production
ENV NODE_OPTIONS="--openssl-legacy-provider"

ARG REACT_APP_API_URL
ARG REACT_APP_PUBLIC_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_CLIENT_ID
ARG REACT_APP_CLIENT_SECRET
ARG REACT_APP_CLIENT_SCOPE

ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_PUBLIC_URL $REACT_APP_PUBLIC_URL
ENV REACT_APP_AUTH_URL $REACT_APP_AUTH_URL
ENV REACT_APP_CLIENT_ID $REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_SECRET $REACT_APP_CLIENT_SECRET
ENV REACT_APP_CLIENT_SCOPE $REACT_APP_CLIENT_SCOPE

WORKDIR '/app'
COPY ./client/package.json ./
RUN npm install
COPY ./client .
RUN npm run build

FROM nginx AS production
COPY --from=0 /app/build /usr/share/nginx/html
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf
CMD sed -i -e 's/80/'"80"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'