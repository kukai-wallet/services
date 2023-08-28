export async function getMetadata(data: any[]) {
    const contractToTokenMap = new Map()

    for (const item of data) {
        const { token } = item

        if (!token) {
            continue
        }

        const { contract, tokenId } = token
        const { address } = contract

        const idsInContract = contractToTokenMap.get(address) || []

        idsInContract.push(tokenId)

        contractToTokenMap.set(address, idsInContract)
    }

    // @TODO: fetch matadata using objkt's v3 api

    return {}
}