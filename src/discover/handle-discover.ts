import { Env } from '../../worker-configuration'
import { VERSIONS, makeResponsePayload } from '../utils/versioning'
import data from './storage/discover_data.json'
import allCategory from './storage/discover_all_category.json'

const HEADERS = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}

export async function handleDiscover(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const version = request.url.includes(VERSIONS.V2) ? VERSIONS.V2 : VERSIONS.V1

    let responsePayload

    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const discoverData = [...(showAll ? allCategory : []), ...data]

    if (version === VERSIONS.V1) {
        responsePayload = JSON.stringify(discoverData)
    } else {
        responsePayload = JSON.stringify(makeResponsePayload(JSON.stringify(discoverData), version, env, request.url))
    }

    return new Response(responsePayload, { headers: HEADERS })
}