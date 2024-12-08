FROM node:20-alpine AS builder

ENV NODE_ENV=build

USER node

WORKDIR /home/node

COPY --chown=node:node ./lib-core ./lib-core

COPY --chown=node:node ./auth-service ./auth-service

WORKDIR /home/node/lib-core

RUN npm run build

WORKDIR /home/node/auth-service

RUN npm run build


FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/auth-service/package*.json ./auth-service/
COPY --from=builder --chown=node:node /home/node/auth-service/node_modules/ ./auth-service/node_modules/
COPY --from=builder --chown=node:node /home/node/auth-service/dist/ ./auth-service/dist/
COPY --from=builder --chown=node:node /home/node/lib-core/dist/ ./lib-core/dist/
COPY --from=builder --chown=node:node /home/node/lib-core/node_modules/ ./lib-core/node_modules/

CMD ["node", "./auth-service/dist/main.js"]
