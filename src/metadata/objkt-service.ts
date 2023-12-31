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
    const editionsMap = new Map()

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
            const { data } = results[index]

            const metadataForTokenIds = data.token
            const editions = data.fa?.[0]?.editions

            editionsMap.set(contract, editions)
            tokenIds.forEach((tokenId: string, index: number) => {
                metadataMap.set(`${contract}/${tokenId}`, metadataForTokenIds[index])
            });

            index++
        }

        const appendedMetadata = [...data]

        appendedMetadata.forEach(item => {
            const contract = item.token?.contract?.address
            const tokenId = item.token?.tokenId

            const key = `${contract}/${tokenId}`
            const objktMetadata = metadataMap.get(key)
            const editionsInContract = editionsMap.get(contract)

            const artifactUri = objktMetadata.artifact_uri
            const attributes = (objktMetadata.attributes || []).map(({ attribute }: any) => ({
                name: attribute.name,
                value: attribute.value,
                frequency: (attribute?.attribute_counts?.[0]?.editions || 0) / editionsInContract
            }))


            if (objktMetadata) {
                item.token.metadata = { ...item.token.metadata, artifactUri, attributes }
            }
        });

        return appendedMetadata
    } catch (error: any) {
        console.log(error.message)
        return data
    }
}