# speed-snitch-admin-ui

Speed snitch administrator UI

# Getting started

Install [Docker](https://docs.docker.com/install), [Docker Compose](https://docs.docker.com/compose/install) and [Make](https://www.gnu.org/software/make). For local deployment, install [Node](https://nodejs.org/en/download).

Project is managed with [Nuxt.js](https://github.com/nuxt/nuxt.js).

## Environment

`cp .env.dist .env` and populate with appropriate values.

`GOOGLE_MAPS_API_KEY` needed to retrieve maps for a given node.

## Run locally

1.  Run `make` from the project root.
1.  The app will be running on the localhost at [http://localhost:8000](http://localhost:8000).

# Build for deployment

1.  Review Environment settings.
1.  `make dist` will produce the production-ready app in the project root's `dist` folder.
