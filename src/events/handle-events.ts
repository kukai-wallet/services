import { Env } from "../../worker-configuration"

export async function handleEvents(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url)

	const eventId = url.searchParams.get('eventId')

	if (!eventId) {
		return new Response("missing event id", { status: 400 })
	}

	const referer = request.headers.get('Referer')
	const domain = !referer ? 'unknown' : new URL(referer).hostname
	const timestamp = new Date().toISOString()

	const key = `event/${eventId}/${timestamp}`

	await env.EVENTS.put(key, JSON.stringify({
		ip_address: request.headers.get('CF-Connecting-IP'),
		user_agent: request.headers.get('User-Agent'),
		timestamp,
		domain,
		event_id: eventId
	}))

	return new Response('ok', { status: 200 });
}

