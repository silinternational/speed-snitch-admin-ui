# Archived

This project is archived and is no longer maintained.

# speed-snitch-admin-ui

Speed snitch administrator UI

# Getting started

Install [Docker](https://docs.docker.com/install), [Docker Compose](https://docs.docker.com/compose/install) and [Make](https://www.gnu.org/software/make). For local deployment, install [Node](https://nodejs.org/en/download).

Project is managed with [vue-cli](https://github.com/vuejs/vue-cli).

## Environment

`cp .env.dist .env` and populate with appropriate values.

`VUE_APP_GOOGLE_MAPS_API_KEY` needed to retrieve maps for a given node.

`VUE_APP_ADMIN_API_BASE_URL` needed for data calls.

## Run locally

1.  Run `make` from the project root.
1.  The app will be running on the localhost at [http://localhost:3000](http://localhost:3000).

## Local development

1.  Run `make dev` from the project root.
1.  The app will be running on the localhost at [http://localhost:3000](http://localhost:3000).

# Build for deployment

1.  Review Environment settings.
1.  `make dist` will produce the production-ready app in the project root's `dist` folder.
