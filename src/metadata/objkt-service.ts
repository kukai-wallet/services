import { USE_OBJKT_FOR_CONTRACTS } from './custom-metadata'
import { makaGraphQLQuery } from './graphql-utils'
const OBJKT_GRAPHQL_ENDPOINT = 'https://data.objkt.com/v3/graphql'

export async function appendMetadata(data: any[]) {
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

    const promises = []
    const requests = new Map()
    const metadataMap = new Map()

    for (const [contract, tokenIds] of contractToTokenMap.entries()) {
        if (!USE_OBJKT_FOR_CONTRACTS.has(contract)) {
            continue
        }

        requests.set(contract, tokenIds)
        promises.push(fetch(OBJKT_GRAPHQL_ENDPOINT, makaGraphQLQuery(contract, tokenIds)))
    }

    try {
        const resolvedPromises = await Promise.all(promises)
        const results: any = await Promise.all(resolvedPromises.map(o => o.json()))

        let index = 0
        for (const [contract, tokenIds] of requests) {

            const metadataForTokenIds = results[index].data.token.map((o: any) => o?.artifact_uri)
            tokenIds.forEach((tokenId: string, index: number) => {
                metadataMap.set(`${contract}/${tokenId}`, metadataForTokenIds[index])
            });

            index++
        }

        const appendedMetadata = [...data]

        appendedMetadata.forEach(item => {
            const key = `${item.token?.contract?.address}/${item.token?.tokenId}`
            const artifactUri = metadataMap.get(key)

            if (artifactUri) {
                item.token.metadata = { ...item.token.metadata, artifactUri }
            }
        });

        return appendedMetadata
    } catch (error: any) {
        console.log(error.message)
        return data
    }
}