# Kukai Services

## Installation

1. Run `yarn` to install dependencies ([install yarn if not available](https://yarnpkg.com/getting-started/install)) 
2. Run `yarn dev` to start a dev server

## Modify

1. Navigate to the path are looking for (i.e. `/version` corresponds to `<endpoint>/v1/version)
2. Navigate to the `storage` folder, modify the `.json` file
3. Test locally with `yarn dev` (i.e. `localhost:8787/v1/version`)

## Deploy

1. Make sure you have `npm` installed, this comes with the `npx` package manager
2. Run `npx wrangler login`
3. Run `npx wrangler publish --env staging` for deploying your changes to the `staging` environment. (See `wrangler.toml` for more options) 

Use `--env production` to deploy to production, or skip the `--env` to deploy to a temporary `.dev` url for further testing. 
Optionally, create a `staging` and a `release` tag/branch to keep track of releases and versions. 
