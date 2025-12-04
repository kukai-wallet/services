import { Alchemy, Network } from "alchemy-sdk";
import { env } from "cloudflare:workers";
import { Env } from "../../worker-configuration";

export const alchemyEth = new Alchemy({
    apiKey: (env as Env).ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
    batchRequests: true,
    connectionInfoOverrides: {
        skipFetchSetup: true,
    },
});