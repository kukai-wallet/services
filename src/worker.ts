import { Env } from '../worker-configuration';
import apiRouter from './router';

const BASE_ENDPOINT = '/v1/'

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname.startsWith(BASE_ENDPOINT)) {
			return apiRouter.handle(request, env, ctx)
		}

		return new Response(JSON.stringify({ heath: 200 }), { headers: { 'Content-Type': 'text/html' } });
	},
};
