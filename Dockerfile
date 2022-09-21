FROM node:18-alpine

RUN mkdir -p /data
WORKDIR /data

EXPOSE 80

# install dependencies
COPY ./package.json /data
COPY ./package-lock.json /data
# TODO: consider `npm ci` for faster buids.
RUN npm install && npm cache clean --force

# irrelevant files referenced in .dockerignore
COPY ./ /data

# build the app into dist folder
RUN npm run build

# Entrypoint gets required env vars from env and puts them in .env
ENTRYPOINT ["/data/entrypoint.sh"]

# default command at runtime spins http server up in production mode
CMD [ "npm", "run", "serve" ] 
