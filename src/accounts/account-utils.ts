import { alchemyEth } from "../constants/alchemy-utils";

export async function getNativeBalance(address: string) {
    const balance = await alchemyEth.core.getBalance(address, 'latest');

    return {
        balance: balance.toString(),
        balanceHex: balance.toHexString()
    }
}