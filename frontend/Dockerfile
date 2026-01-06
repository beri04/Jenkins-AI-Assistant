FROM node:20-alpine AS builder
WORKDIR /app

# build-time env (for Next.js)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 👇 re-declare ARG in this stage
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
