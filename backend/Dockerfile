# Build context: repository root (needed for the shared package-lock.json).
FROM node:25-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN npm ci --omit=dev --workspace backend && npm cache clean --force

COPY backend backend

USER node
EXPOSE 3000
CMD ["node", "backend/src/server.js"]
