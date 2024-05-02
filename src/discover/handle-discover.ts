import { Env } from '../../worker-configuration'
import { NETWORK, VERSIONS, getNetwork, makeResponsePayload } from '../utils/versioning'
import data from './storage/discover_data.json'
import dataV3 from './storage/discover_data_v3.json'
import dataMainnetV4 from './storage/v4.mainnet.json'
import dataGhostnetV4 from './storage/v4.ghostnet.json'
import allCategory from './storage/discover_all_category.json'
import allCategoryNewSchemaMainnet from './storage/v4-all-category.mainnet.json'
import allCategoryNewSchemaGhostnet from './storage/v4-all-category.ghostnet.json'

const HEADERS = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}

const VERSIONS_WITH_ALL_CATEGORY = new Set([VERSIONS.V3, VERSIONS.V4])

function getDiscoverData(network: NETWORK, version: VERSIONS, showAll: boolean) {
    if (VERSIONS_WITH_ALL_CATEGORY.has(version)) {
        if (version === VERSIONS.V4) {
            const isGhostnet = network === NETWORK.GHOSTNET
            const data = isGhostnet ? dataGhostnetV4 : dataMainnetV4
            const dataAllCategory = isGhostnet ? allCategoryNewSchemaGhostnet : allCategoryNewSchemaMainnet
            return [...(showAll ? dataAllCategory : []), ...data]
        }

        return {
            mainnet: [...(showAll ? allCategoryNewSchemaMainnet : []), ...dataV3.mainnet],
            ghostnet: dataV3.ghostnet
        }
    } else {
        return [...(showAll ? allCategory : []), ...data]
    }
}

export async function handleDiscover(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = request.url.endsWith("/") ? request.url.slice(0, -1) : request.url
    const paths = url.split("/")
    const version = `/${paths[paths.length - 2]}/` as VERSIONS
    const network = getNetwork(url)

    let responsePayload

    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const discoverData = getDiscoverData(network, version, showAll)

    if (version === VERSIONS.V1) {
        responsePayload = JSON.stringify(discoverData)
    } else {
        responsePayload = JSON.stringify(makeResponsePayload(JSON.stringify(discoverData), version, env, request.url))
    }

    return new Response(responsePayload, { headers: HEADERS })
}