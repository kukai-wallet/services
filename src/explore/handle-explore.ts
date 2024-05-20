import { Env } from '../../worker-configuration'
import { getParams } from '../utils/param-utils'
import { VERSIONS, getNetwork, getVersion, makeResponsePayload } from '../utils/versioning'
import { Dataset } from "./storage/dataset"

const ArrayTypes = new Set(['contractAddresses', 'discover.category'])

const SHOULD_DISPLAY_LINK_KEY = 'shouldDisplayLink'

export const REMAP: Record<string, string> = {
    contract: 'contractAddresses',
    contractAddress: 'contractAddresses',
}

const HEADERS = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}

export async function handleExpore(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const network = getNetwork(request.url)
    const version = getVersion(request.url)

    try {
        const params = getParams(request.url)
        const dataset = new Dataset({ version, network })

        delete params.encode
        const paramKeys = Object.keys(params)

        for (const rawKey of paramKeys) {
            if (rawKey === SHOULD_DISPLAY_LINK_KEY) {
                dataset.addFilter(o => String(!!o.discover) === params[rawKey])
                continue
            }

            const key = REMAP[rawKey] || rawKey

            const [key0, key1] = key.split('.')
            const value = params[rawKey]

            ArrayTypes.has(key)
                ? dataset.addFilter(o => (!key1 ? o[key0] : o[key0]?.[key1])?.includes(value))
                : dataset.addFilter(o => String(!key1 ? o[key0] : o[key0]?.[key1]) === value.toLowerCase())
        }

        const snapshot = dataset.getSnapshot()
        let responsePayload

        if (version === VERSIONS.V1) {
            responsePayload = snapshot
        } else {
            responsePayload = JSON.stringify(makeResponsePayload(snapshot, version, env, request.url))
        }

        return new Response(responsePayload, { status: 200, headers: HEADERS })
    } catch (error) {
        console.error('Internal error:', error);
        return new Response('Internal Error', { status: 500 })
    }
}

