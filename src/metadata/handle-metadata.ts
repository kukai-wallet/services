import { Env } from "../../worker-configuration"
import { getMetadata } from "./objkt-service"

const _HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Cache-Control': 'max-age: 10'
}

const PREFIX_LENGTH = '/v1/metadata'.length

const BASE = 'https://api.tzkt.io'

export async function handleMetadata(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url)
	const query = url.href.substring(url.origin.length + PREFIX_LENGTH)
	const response = await fetch(`${BASE}${query}`)

	const data = await response.clone().json()

	const metadata = getMetadata(data as any[])

	return new Response(response.body)
}

