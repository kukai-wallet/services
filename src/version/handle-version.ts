import { Env } from "../../worker-configuration"

const HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Content-Type': 'application/json',
}

const MOBILE_VERSION_STORAGE_KEY = 'mobileVersion'

export async function handleVersion(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {

	const mobileVersion = await env.KV_STORAGE.get(MOBILE_VERSION_STORAGE_KEY)

	return new Response(mobileVersion, { headers: HEADERS })
}

