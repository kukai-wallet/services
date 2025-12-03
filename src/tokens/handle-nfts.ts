import { alchemyEth } from "../constants/alchemy-utils";
import { Token } from "./token-utils";

export async function getNftsForOwner(address: string): Promise<Token[]> {
    const allAssets: Token[] = [];
    let pageKey: string | undefined;

    do {
        const response = await alchemyEth.nft.getNftsForOwner(address, { pageKey });

        const nftAssets: Token[] = response.ownedNfts.map(nft => ({
            contractAddress: nft.contract.address,
            tokenId: nft.tokenId,
            balance: nft.balance,
            name: nft.contract.name || nft.name || null,
            symbol: nft.contract.symbol || null,
            decimals: null,
            logo: nft.image?.thumbnailUrl || nft.image?.cachedUrl || nft.contract.openSeaMetadata?.imageUrl || null,
            type: 'NFT' as const,
        }));

        allAssets.push(...nftAssets);
        pageKey = response.pageKey;
    } while (pageKey);

    return allAssets;
}
