import { Env } from "../../worker-configuration";

const PREFIX = "event/app-stake-a"

const HEADERS = { 'Content-Type': 'application/json' }
const BATCH_SIZE = 5
const LIMIT = 200

export async function handleListEvents(request: Request, env: Env) {
    const url = new URL(request.url)

    const fullParam = url.searchParams.get('full')
    const page = url.searchParams.get('page') || '0'
    const returnFullResult = fullParam === 'true'

    const listResult = await env.EVENTS.list({ prefix: PREFIX });

    if (returnFullResult) {
        const fullResult = await getFullResult(listResult, page, env)

        return new Response(JSON.stringify(fullResult, null, 2), {
            headers: HEADERS,
        });
    }

    return new Response(JSON.stringify(listResult.keys, null, 2), {
        headers: HEADERS
    });
}

async function getFullResult(listResult: KVNamespaceListResult<unknown, string>, page: string, env: Env) {
    const keys = listResult.keys.map(key => key.name);
    const fullResults: Record<string, any>[] = [];


    async function processBatch(batch: string[]) {
        const results = await Promise.all(
            batch.map(async (key) => {
                const value = await env.EVENTS.get(key);
                return { key, value: JSON.parse(value!) };
            })
        );

        fullResults.push(...results);
    };

    const pageIndex = parseInt(page) || 0
    const startIndex = pageIndex * LIMIT
    const endIndex = startIndex + LIMIT - 1

    for (let i = startIndex; i < keys.length; i += BATCH_SIZE) {
        if (i > endIndex) {
            break
        }

        const batch = keys.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
    }

    return fullResults
}