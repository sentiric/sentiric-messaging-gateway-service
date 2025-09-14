# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

# Build argümanlarını build aşamasında kullanılabilir yap
ARG GIT_COMMIT="unknown"
ARG BUILD_DATE="unknown"
ARG SERVICE_VERSION="0.0.0"

WORKDIR /app

# Sistem bağımlılıkları
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    git

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

COPY package.json package-lock.json ./
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

# DÜZELTME: Başlangıçta kilit dosyasını güvenilir bir şekilde sil.
# Bu, hem 'dev' hem de 'core' profilinde tutarlı çalışır.
CMD ["sh", "-c", "rm -f /app/wweb_auth/SingletonLock && node dist/index.js"]