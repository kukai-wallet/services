import { Env } from "../../worker-configuration"
import { appendMetadata } from "./objkt-service"

const HEADERS = {
	"content-type": "application/json;charset=UTF-8",
}

const PREFIX_LENGTH = '/v1/metadata'.length

const BASE = 'https://api.tzkt.io'

export async function handleMetadata(request: Request, _env: Env, context: ExecutionContext): Promise<Response> {
	const url = new URL(request.url)
	const query = url.href.substring(url.origin.length + PREFIX_LENGTH)

	const response = await fetch(`${BASE}${query}`)

	const data = await response.json()
	const customData = await appendMetadata(data as any[])

	return new Response(JSON.stringify(customData), { headers: HEADERS })
}

