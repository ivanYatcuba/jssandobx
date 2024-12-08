FROM node:20-alpine AS builder

ENV NODE_ENV=build

USER node

WORKDIR /home/node

COPY --chown=node:node ./lib-core ./lib-core

COPY --chown=node:node ./socialnet-api ./socialnet-api

WORKDIR /home/node/lib-core

RUN npm run build

WORKDIR /home/node/socialnet-api

RUN npm run build


FROM node:20-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/socialnet-api/package*.json ./socialnet-api/
COPY --from=builder --chown=node:node /home/node/socialnet-api/node_modules/ ./socialnet-api/node_modules/
COPY --from=builder --chown=node:node /home/node/socialnet-api/dist/ ./socialnet-api/dist/
COPY --from=builder --chown=node:node /home/node/lib-core/dist/ ./lib-core/dist/
COPY --from=builder --chown=node:node /home/node/lib-core/node_modules/ ./lib-core/node_modules/

CMD ["node", "./socialnet-api/dist/main.js"]
