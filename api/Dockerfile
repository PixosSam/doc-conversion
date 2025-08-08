FROM node:22.18.0 as builder

WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22.18.0

# Install necessary dependencies for Puppeteer and Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libxshmfence1 \
  libglu1-mesa \
# chromium \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Puppeteer setup: Skip Chromium download and use the installed Chromium
ENV PORT=80
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

WORKDIR /app
COPY ./package.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist /app
EXPOSE 80

CMD ["npm", "start"]