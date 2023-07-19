import { RouteHandler, Router } from 'itty-router';
import { handleExpore } from './explore/handle-explore';
import { handleProxy } from './proxy/handle-proxy';
import { handleDiscover } from './discover/handle-discover';

export enum ROUTES {
	DISCOVER = '/v1/discover',
	EXPLORE = '/v1/explore',
	PROXY = '/v1/proxy',
}

const router = Router();

router.get(ROUTES.PROXY, handleProxy as unknown as RouteHandler)
router.get(ROUTES.EXPLORE, handleExpore as unknown as RouteHandler)
router.get(ROUTES.DISCOVER, handleDiscover as unknown as RouteHandler)

router.post('/api/todos', async (request) => {
	const content = await request.json()
	return new Response('Creating Todo: ' + JSON.stringify(content))
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
