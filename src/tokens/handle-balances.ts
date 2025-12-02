import { Env } from '../../worker-configuration';
import { CHAINS, SUPPORTED_CHAINS } from '../constants/chains';
import { BASE_HEADERS } from '../constants/request-utils';
import { getEnrichedTokenBalances } from './token-utils';

export async function handleTokenBalances(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	const account = url.searchParams.get('account');
	const chain = url.searchParams.get('chain') as CHAINS;

	if (!account) {
		return new Response(JSON.stringify({ error: 'Missing account parameter' }), { status: 400, headers: BASE_HEADERS });
	}

	if (!SUPPORTED_CHAINS.has(chain)) {
		return new Response(JSON.stringify({ error: 'Unsupported chain' }), { status: 400, headers: BASE_HEADERS });
	}

	try {
		const result = await getEnrichedTokenBalances(account, { apiKey: env.ALCHEMY_API_KEY, network: chain });
		return new Response(JSON.stringify(result), { status: 200, headers: { ...BASE_HEADERS, 'Cache-Control': 'public, max-age=60' } });
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch token balances',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{ status: 500, headers: BASE_HEADERS }
		);
	}
};
