import { Env } from "../../worker-configuration"

const HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Cache-Control': 'max-age: 10'
}

const CONTENT_TYPE = 'Content-Type'
const APPLICATION_JSON = 'application/json'

enum ERRORS {
	MISSING_URI_ERROR = 'Bad request: Missing uri',
	NOT_JSON = 'Error: content-type is not json'
}

export async function handleProxy(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url)

	const proxyUri = url.searchParams.get('uri')

	if (!proxyUri) {
		return new Response(ERRORS.MISSING_URI_ERROR, { status: 400 })
	}

	const response = await fetch(decodeURIComponent(proxyUri), request)

	if (!response.headers.get(CONTENT_TYPE)?.includes(APPLICATION_JSON)) {
		return new Response(ERRORS.NOT_JSON, { status: 400 })
	}

	return new Response(response.body, { headers: HEADERS })
}

