# Builder Stage
FROM node:22-alpine AS builder
WORKDIR /app

ENV PNPM_CONFIG_MINIMUM_RELEASE_AGE=0

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install

COPY frontend/ .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm run build

# Runner Stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
