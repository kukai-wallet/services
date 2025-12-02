export enum ENVIRONMENT_TAG {
	DEV = 'dev',
	PRODUCTION = 'production',
	STAGING = 'staging',
}

export interface Env {
	ENVIRONMENT: ENVIRONMENT_TAG
	EVENTS: KVNamespace
	ALCHEMY_API_KEY: string
	WS_DURABLE_OBJECT: DurableObjectNamespace
}
