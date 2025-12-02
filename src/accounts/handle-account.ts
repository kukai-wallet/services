import { Env } from '../../worker-configuration';
import { CHAINS, SUPPORTED_CHAINS } from '../constants/chains';
import { BASE_HEADERS } from '../constants/request-utils';
import { getNativeBalance } from './account-utils';

export async function handleAccount(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	const pathParts = url.pathname.split('/');
	const address = pathParts[pathParts.length - 1];
	const chain = url.searchParams.get('chain') as CHAINS;

	if (!address || address === 'accounts') {
		return new Response(
			JSON.stringify({ error: 'Invalid address' }),
			{ status: 400, headers: BASE_HEADERS }
		);
	}

	if (!SUPPORTED_CHAINS.has(chain)) {
		return new Response(
			JSON.stringify({ error: 'Chain is not supported' }),
			{ status: 500, headers: BASE_HEADERS }
		);
	}

	try {
		const { balance, balanceHex } = await getNativeBalance(address, { apiKey: env.ALCHEMY_API_KEY, network: chain });

		return new Response(
			JSON.stringify({
				address: address.toLowerCase(),
				balance,
				balanceHex,
				symbol: 'ETH',
			}),
			{ status: 200, headers: { ...BASE_HEADERS, 'Cache-Control': 'public, max-age=60' } }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch account balance',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{ status: 500, headers: BASE_HEADERS }
		);
	}
}
