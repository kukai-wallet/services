import { Env } from '../../worker-configuration'
import discoverData from './storage/discover_data.json'

const HEADERS = {
    "content-type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
}

export async function handleDiscover(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const response = JSON.stringify(discoverData, null, 2)
    return new Response(response, { headers: HEADERS })
}