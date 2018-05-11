FROM node:alpine

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

# default command at runtime spins http server up in production mode
CMD [ "npm", "start" ] 
