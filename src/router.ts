import { RouteHandler, Router } from 'itty-router';
import { handleDiscover } from './discover/handle-discover';
import { handleExpore } from './explore/handle-explore';
import { handleMetadata } from './metadata/handle-metadata';
import { handleProxy } from './proxy/handle-proxy';

export enum ROUTES {
	DISCOVER = '/v1/discover',
	EXPLORE = '/v1/explore',
	METADATA = '/v1/metadata/*',
	PROXY = '/v1/proxy',
}

const router = Router();

router.get(ROUTES.DISCOVER, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.EXPLORE, handleExpore as unknown as RouteHandler)
router.get(ROUTES.METADATA, handleMetadata as unknown as RouteHandler)
router.get(ROUTES.PROXY, handleProxy as unknown as RouteHandler)

router.post('/api/todos', async (request) => {
	const content = await request.json()
	return new Response('Creating Todo: ' + JSON.stringify(content))
})

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
