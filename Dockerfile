FROM node:20-alpine

WORKDIR /app

# Install production deps (no lockfile needed in drop)
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy compiled app and runtime tsconfig for alias resolution
COPY dist ./dist
COPY tsconfig.runtime.json ./tsconfig.json

# Copy assets used by Express in production
COPY src/views ./dist/views
COPY src/public ./dist/public

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]