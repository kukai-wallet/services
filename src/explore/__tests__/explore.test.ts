import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { VERSIONS } from "../../utils/versioning";
import worker from "../../worker";
import { Env } from "../../../worker-configuration";
import crypto from 'crypto'

const DEV_ENV = {
    PRIVATE_KEY: crypto.randomBytes(64).toString('hex')
} as unknown as Env

const LOCAL_BASE_URL = 'http://localhost:8787'
const SERVICES_BASE_URL = 'https://services.kukai.app'

const ENDPOINTS_TO_TEST = [
    `${VERSIONS.V1}explore`,
]

describe("compares explore to production", () => {
    ENDPOINTS_TO_TEST.forEach((endpoint) => {
        it(`tests ${endpoint}`, async () => {
            const localRequest = new Request(`${LOCAL_BASE_URL}${endpoint}`)
            const externalRequest = fetch(`${SERVICES_BASE_URL}${endpoint}`)

            const ctx = createExecutionContext()
            const localResponse = await worker.fetch(localRequest, DEV_ENV, ctx)
            const externalResponse = await externalRequest
            await waitOnExecutionContext(ctx)

            const localJsonResponse = await localResponse.json() as any
            const externalJsonResponse = await externalResponse.json() as any

            expect(localJsonResponse.data).toEqual(externalJsonResponse.data)
        })
    })
})