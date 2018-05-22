#!/usr/bin/env sh

echo "GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}" >> .env
echo "ADMIN_API_BASE_URL=${ADMIN_API_BASE_URL}" >> .env

# Rebuild app with .env in place
npm run build

exec "$@"