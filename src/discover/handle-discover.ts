import { Env } from '../../worker-configuration'
import discoverData from './storage/discover_data.json'

export async function handleDiscover(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    return new Response(JSON.stringify(discoverData, null, 2), { status: 200 })
}