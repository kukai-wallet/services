export enum ENVIRONMENT_TAG {
	DEV = 'dev',
	PRODUCTION = 'production',
	STAGING = 'staging',
}

export interface Env {
	ENVIRONMENT: ENVIRONMENT_TAG
	KV_STORAGE: KVNamespace
	EVENTS: KVNamespace
}
