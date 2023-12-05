# Kukai Services

## Installation

1. Run `yarn` to install dependencies ([install yarn if not available](https://yarnpkg.com/getting-started/install)) 
2. Run `yarn dev` to start a dev server

## Deploy

Deployments are handled automatically with github actions (see the pipelines in `.github/workflows/`). 

Pushing to the `main` branch will update production while pushing to `staging` will update staging:
```perl
push to /main    → updates services.kukai.app
push to /staging → updates staging.services.kukai.app
```

## Modify

1. Navigate to the path are looking for (i.e. `/version` corresponds to `<endpoint>/v1/version`)
2. Navigate to the `storage` folder, modify the `.json` file
3. Test locally with `yarn dev` (i.e. `localhost:8787/v1/version`)






