# --- STAGE 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Sistem bağımlılıklarını kur
# whatsapp-web.js'in puppeteer'ı için chromium ve diğer kütüphaneler gereklidir.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    git

# Puppeteer'ın bu ENV değişkenine ihtiyacı var.
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

COPY package.json package-lock.json ./
# Tüm bağımlılıkları kur
RUN npm ci

COPY . .
RUN npm run build

# --- STAGE 2: Production ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Sadece üretim için gerekli sistem bağımlılıkları
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

# Oturum bilgilerinin saklanacağı klasörü oluştur ve izinlerini ayarla
RUN mkdir -p /app/wweb_auth && chown -R node /app
USER node

CMD ["node", "dist/index.js"]