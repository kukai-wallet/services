import { AlchemyConfig, AlchemyError } from "../types/response-types";

export interface TokenBalance {
    contractAddress: string;
    tokenBalance: string;
    error?: string;
}

export interface TokenMetadata {
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    logo: string | null;
}

export interface EnrichedTokenBalance {
    contractAddress: string;
    balance: string;
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    logo: string | null;
}

export interface GetTokenBalancesResponse {
    address: string;
    tokenBalances: TokenBalance[];
}

export interface GetEnrichedTokenBalancesResponse {
    address: string;
    tokens: EnrichedTokenBalance[];
}

export async function getTokenMetadata(contractAddress: string, config: AlchemyConfig): Promise<TokenMetadata> {
    const url = `https://${config.network}.g.alchemy.com/v2/${config.apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_getTokenMetadata',
            params: [contractAddress],
            id: 1,
        }),
    });

    const data = await response.json<{ result?: TokenMetadata, error?: AlchemyError }>();

    if (data.error || !data.result) {
        return {
            name: null,
            symbol: null,
            decimals: null,
            logo: null,
        };
    }

    return data.result;
}

export async function getEnrichedTokenBalances(address: string, config: AlchemyConfig): Promise<GetEnrichedTokenBalancesResponse> {
    const balancesResponse = await getTokenBalances(address, config);

    const enrichedTokens = await Promise.all(
        balancesResponse.tokenBalances
            .filter(token => !token.error && token.tokenBalance !== '0x')
            .map(async (token) => {
                const metadata = await getTokenMetadata(token.contractAddress, config);
                const balanceHex = token.tokenBalance;

                return {
                    contractAddress: token.contractAddress,
                    balance: BigInt(balanceHex).toString(),
                    balanceHex,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    decimals: metadata.decimals,
                    logo: metadata.logo,
                };
            })
    );

    return {
        address: balancesResponse.address,
        tokens: enrichedTokens,
    };
}


export async function getTokenBalances(address: string, config: AlchemyConfig): Promise<GetTokenBalancesResponse> {
    const url = `https://${config.network}.g.alchemy.com/v2/${config.apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'alchemy_getTokenBalances',
            params: [address, 'erc20'],
            id: 1,
        }),
    });

    const data = await response.json<{
        result?: {
            address: string;
            tokenBalances: TokenBalance[];
        };
        error?: AlchemyError
    }>();

    if (!response.ok || data.error) {
        throw new Error(`Alchemy API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.result) {
        throw new Error('Alchemy API returned no result');
    }

    return data.result;
}
