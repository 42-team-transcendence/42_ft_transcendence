#!/bin/bash

npm install
npx prisma generate
npx prisma migrate dev --name first-migration --schema='./prisma/schema.prisma' --preview-feature

exec "$@"