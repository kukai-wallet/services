import { RouteHandler, Router } from 'itty-router';
import { handleDiscover } from './discover/handle-discover';
import { handleExpore } from './explore/handle-explore';
import { handleMetadata } from './metadata/handle-metadata';
import { handleVersion } from './version/handle-version';
import { handleProxy } from './proxy/handle-proxy';

export enum ROUTES {
	DISCOVER = '/v1/discover',
	DISCOVER_V2 = '/v2/discover',
	DISCOVER_V3 = '/v3/discover',
	EXPLORE = '/v1/explore',
	EXPLORE_V2 = '/v2/explore',
	METADATA = '/v1/metadata/*',
	PROXY = '/v1/proxy',
	VERSION = '/v1/version',
}

const router = Router();

router.get(ROUTES.DISCOVER, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.DISCOVER_V2, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.DISCOVER_V3, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.EXPLORE, handleExpore as unknown as RouteHandler)
router.get(ROUTES.EXPLORE_V2, handleExpore as unknown as RouteHandler)
router.get(ROUTES.METADATA, handleMetadata as unknown as RouteHandler)
router.get(ROUTES.PROXY, handleProxy as unknown as RouteHandler)
router.get(ROUTES.VERSION, handleVersion as unknown as RouteHandler)

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
