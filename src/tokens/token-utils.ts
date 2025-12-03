import { TokenBalanceType } from 'alchemy-sdk';
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
        const response = await alchemyEth.core.getTokenBalances(address, {
            type: TokenBalanceType.ERC20,
            pageKey,
        });

        const enrichedTokens = await Promise.all(
            response.tokenBalances
                .filter(token => token.tokenBalance && token.tokenBalance !== '0x' && token.tokenBalance !== '0x0')
                .map(async (token) => {
                    const metadata = await alchemyEth.core.getTokenMetadata(token.contractAddress);
                    const balanceHex = token.tokenBalance!;

                    return {
                        contractAddress: token.contractAddress,
                        balance: BigInt(balanceHex).toString(),
                        balanceHex,
                        name: metadata.name,
                        symbol: metadata.symbol,
                        decimals: metadata.decimals,
                        logo: metadata.logo,
                        type: 'ERC20' as const,
                    };
                })
        );

        allAssets.push(...enrichedTokens);
        pageKey = response.pageKey;
    } while (pageKey);

    return allAssets;
}
