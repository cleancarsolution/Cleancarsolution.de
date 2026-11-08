# syntax=docker/dockerfile:1
# Build-Kontext ist das Monorepo-Root:
#   docker build -f apps/api/Dockerfile -t ccs-api .
#   docker run -p 4000:4000 --env-file apps/api/.env -v ccs-data:/app/data ccs-api

FROM node:24-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci --workspace @ccs/api --include-workspace-root --no-fund --no-audit
COPY packages/tsconfig packages/tsconfig
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace @ccs/api

FROM node:24-alpine AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4000 DATA_DIR=/app/data
WORKDIR /app
COPY --from=build /repo/apps/api/package.json ./package.json
# @ccs/shared ist bereits ins Bundle eingebettet – nur echte Laufzeit-Abhängigkeiten installieren
RUN npm pkg delete "dependencies.@ccs/shared" \
  && npm install --omit=dev --no-package-lock --no-fund --no-audit \
  && npm cache clean --force
COPY --from=build /repo/apps/api/dist ./dist
RUN mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 4000
VOLUME ["/app/data"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- http://127.0.0.1:4000/health || exit 1
CMD ["node", "dist/server.js"]
