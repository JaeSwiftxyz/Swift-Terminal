FROM node:22-slim AS build
WORKDIR /app
COPY package.json ./
COPY server/package.json server/
RUN npm install --workspace server --include-workspace-root=false || npm install --prefix server
COPY server/tsconfig.json server/
COPY server/src server/src
RUN npm run build --prefix server

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
# curl is used by the nasdaq provider — api.nasdaq.com's edge blocks node's TLS
# from datacenter IPs. The base image ships no CA store, and
# http://deb.debian.org is unreachable from some build networks — bootstrap apt
# over https once without peer verification, which installs ca-certificates.
RUN if [ -f /etc/apt/sources.list.d/debian.sources ]; then sed -i 's|http://deb.debian.org|https://deb.debian.org|' /etc/apt/sources.list.d/debian.sources; fi \
 && apt-get -o Acquire::https::Verify-Peer=false update \
 && apt-get -o Acquire::https::Verify-Peer=false install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY server/package.json ./
RUN npm install --omit=dev
COPY --from=build /app/server/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
