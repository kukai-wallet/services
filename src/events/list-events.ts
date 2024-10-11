import { Env } from "../../worker-configuration";

export async function handleEvents(request: Request, env: Env) {
    const prefix = 'event/app-stake-a';

    const listResult = await env.EVENTS.list({ prefix });

    return new Response(JSON.stringify(listResult.keys, null, 2), {
        headers: { 'Content-Type': 'application/json' },
    });
}
