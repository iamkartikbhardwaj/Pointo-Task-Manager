# 1) Install dependencies only
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2) Copy source & run
FROM node:20-alpine AS runner
WORKDIR /app

# copy only production deps
COPY --from=deps /app/node_modules ./node_modules
# copy everything else
COPY . .

# bind to 0.0.0.0, use env PORT or default 8000
ENV NODE_ENV=production
EXPOSE 8000
CMD ["node", "src/index.js"]
