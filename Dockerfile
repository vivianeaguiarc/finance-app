FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl postgresql-client wget

ENV NODE_ENV=development
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY index.js ./
COPY src ./src
COPY docs ./docs
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN sed -i 's/\r$//' ./docker/entrypoint.sh && chmod +x ./docker/entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
    CMD wget -qO- http://127.0.0.1:3000/health >/dev/null 2>&1 || exit 1

ENTRYPOINT ["sh", "./docker/entrypoint.sh"]
CMD ["node", "index.js"]
