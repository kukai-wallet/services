# Kukai Services

## Installation

1. Run `yarn` to install dependencies ([install yarn if not available](https://yarnpkg.com/getting-started/install)) 
2. Run `yarn dev` to start a dev server, or `yarn prod` to start a prod server (requires wrangler/cloudflare credentials)

## Deploy

Run `yarn deploy` to deploy to production, or `yarn deploy --env staging` to deploy using the staging environment. 
All deployments require wrangler/cloudflare credentials.

```perl
production → services.kukai.app
staging    → staging.services.kukai.app
```

## Modify

1. Navigate to the path are looking for (i.e. `/version` corresponds to `<endpoint>/v1/version`)
2. Navigate to the `storage` folder, modify the `.json` file
3. Test locally with `yarn dev` (i.e. `localhost:8787/v1/version`)

--- 
## Api services
*Production endpoint*: https://services.kukai.app/

*Staging endpoint*: https://staging.services.kukai.app/

| Service  | Purpose | Endpoint |
| ------------- | ------------- | ------------- |
| **Discover**  | Info regarding NFT projects (for kukai.app & iOS)  | `/v1/discover` |
| **Explore**   | Info regarding the Explore page (kukai.app & iOS)  | `/v1/explore` |
| **Metadata**  | Tzkt wrapper for `/tokens/balances`, it augments tzkt's responses with custom metadata for specific contracts/tokens  | `/v1/metadata` |
| **Version**   | Info regarding suggested/required mobile versions (iOS & Android)  | `/v1/version` |
| **Proxy**     | A typical api proxy primarily used for ip anonymity  | `/v1/proxy` |


