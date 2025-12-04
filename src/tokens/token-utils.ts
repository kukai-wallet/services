import { alchemyEth } from '../constants/alchemy-utils';

export interface Token {
    contractAddress: string;
    tokenId?: string;
    balance: string;
    balanceHex?: string;
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    logo: string | null;
    type: 'ERC20' | 'NFT';
}

export async function getEnrichedTokenBalances(address: string): Promise<Token[]> {
    const allAssets: Token[] = [];
    let pageKey: string | undefined;

    do {
        const response = await alchemyEth.core.getTokensForOwner(address, { pageKey });

        const enrichedTokens = response.tokens
            .filter(token => token.rawBalance && token.rawBalance !== '0x' && token.rawBalance !== '0x0')
            .map((token) => {
                const balanceHex = token.rawBalance!;

                return {
                    contractAddress: token.contractAddress,
                    balance: token.balance || BigInt(balanceHex).toString(),
                    balanceHex,
                    name: token.name || null,
                    symbol: token.symbol || null,
                    decimals: token.decimals ?? null,
                    logo: token.logo || null,
                    type: 'ERC20' as const,
                };
            });

        allAssets.push(...enrichedTokens);
        pageKey = response.pageKey;
    } while (pageKey);

    return allAssets;
}
