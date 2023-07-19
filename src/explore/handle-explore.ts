import { Env } from '../../worker-configuration'
import { Dataset } from "./storage/dataset"

const ArrayTypes = new Set(['contractAddresses', 'discover.category'])

const SHOULD_DISPLAY_LINK_KEY = 'shouldDisplayLink'

export const REMAP: Record<string, string> = {
    contract: 'contractAddresses',
    contractAddress: 'contractAddresses',
}

export async function handleExpore(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    try {
        const params = getParams(request.url)
        const dataset = new Dataset()

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

        const responseData = dataset.getSnapshot()

        return new Response(responseData, { status: 200 })
    } catch (error) {
        console.error('Internal error:', error);
        return new Response('Internal Error', { status: 500 })
    }
}

function getParams(requestUrl: string) {
    const url = new URL(requestUrl)

    const urlParams = new URLSearchParams(url.searchParams)
    const params: Record<string, string> = {}

    for (const [key, value] of urlParams) {
        params[key] = value
    }

    return params
}