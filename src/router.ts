import { RouteHandler, Router } from 'itty-router';
import { handleDiscover } from './discover/handle-discover';
import { handleExpore } from './explore/handle-explore';
import { handleMetadata } from './metadata/handle-metadata';
import { handleAssets } from './onboarding/discover/handle-assets';
import { handleProxy } from './proxy/handle-proxy';
import { handleVersion } from './version/handle-version';

export enum ROUTES {
	DISCOVER = '/v1/discover',
	DISCOVER_V2 = '/v2/discover',
	DISCOVER_V3 = '/v3/discover',
	DISCOVER_V4 = '/v4/discover',

	EXPLORE = '/v1/explore',
	EXPLORE_V2 = '/v2/explore',
	EXPLORE_V4 = '/v4/explore',

	ONBOARDING_DISCOVER_ASSETS = '/v4/onboarding/discover/assets/*',

	METADATA = '/v1/metadata/*',
	PROXY = '/v1/proxy',
	VERSION = '/v1/version',
}

const router = Router();

router.get(ROUTES.DISCOVER, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.DISCOVER_V2, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.DISCOVER_V3, handleDiscover as unknown as RouteHandler)
router.get(ROUTES.DISCOVER_V4, handleDiscover as unknown as RouteHandler)

router.get(ROUTES.EXPLORE, handleExpore as unknown as RouteHandler)
router.get(ROUTES.EXPLORE_V2, handleExpore as unknown as RouteHandler)
router.get(ROUTES.EXPLORE_V4, handleExpore as unknown as RouteHandler)

router.get(ROUTES.ONBOARDING_DISCOVER_ASSETS, handleAssets as unknown as RouteHandler)

router.get(ROUTES.METADATA, handleMetadata as unknown as RouteHandler)
router.get(ROUTES.PROXY, handleProxy as unknown as RouteHandler)
router.get(ROUTES.VERSION, handleVersion as unknown as RouteHandler)

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
