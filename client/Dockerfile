# Base image
FROM node:16-alpine as dev

# Create app directory and go into it
WORKDIR /app

COPY ./bin/entrypoint.sh /usr/bin/entrypoint.sh

# RUN apk update
# RUN apk add --no-cache \
#     curl \
#     vim

# Start the frontend application
ENTRYPOINT [ "/bin/sh", "/usr/bin/entrypoint.sh" ]