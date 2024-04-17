import { Env } from '../worker-configuration';
import apiRouter from './router';
import { VERSIONS } from './utils/versioning';

const ALLOWED_VERSIONS = new Set<string>([VERSIONS.V1, VERSIONS.V2, VERSIONS.V3])

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (ALLOWED_VERSIONS.has(url.pathname.substring(0, 4))) {
			return apiRouter.handle(request, env, ctx)
		}

		return new Response(JSON.stringify({ heath: 200 }), { headers: { 'Content-Type': 'text/html' } });
	},
};
