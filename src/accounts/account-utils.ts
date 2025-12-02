import { AlchemyConfig, AlchemyError } from "../types/response-types";

export async function getNativeBalance(address: string, config: AlchemyConfig) {
    const url = `https://${config.network}.g.alchemy.com/v2/${config.apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1,
        }),
    });

    const data = await response.json<{ result?: string; error?: AlchemyError }>();

    if (!response.ok || data.error) {
        throw new Error(`Alchemy API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.result) {
        throw new Error('Alchemy API returned no result');
    }

    const balanceHex = data.result;

    return {
        balance: BigInt(balanceHex).toString(),
        balanceHex
    }
}