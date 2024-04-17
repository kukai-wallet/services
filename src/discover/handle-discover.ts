import { Env } from '../../worker-configuration'
import { VERSIONS, makeResponsePayload } from '../utils/versioning'
import data from './storage/discover_data.json'
import dataV3 from './storage/discover_data_v3.json'
import allCategory from './storage/discover_all_category.json'
import allCategoryV3 from './storage/discover_all_category_v3.json'

const HEADERS = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}

function getDiscoverData(version: VERSIONS, showAll: boolean) {
    console.log('>>>>>> version::', version)
    if (version === VERSIONS.V3) {
        return {
            mainnet: [...(showAll ? allCategoryV3 : []), ...dataV3.mainnet],
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

    let responsePayload

    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const discoverData = getDiscoverData(version, showAll)

    if (version === VERSIONS.V1) {
        responsePayload = JSON.stringify(discoverData)
    } else {
        responsePayload = JSON.stringify(makeResponsePayload(JSON.stringify(discoverData), version, env, request.url))
    }

    return new Response(responsePayload, { headers: HEADERS })
}