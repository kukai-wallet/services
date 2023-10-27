import { Env } from "../../worker-configuration"
import mobileVersionData from "./storage/mobile-version.json"

const HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Content-Type': 'application/json',
}

export async function handleVersion(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {

	const mobileVersion = JSON.stringify(mobileVersionData, null, 2)

	return new Response(mobileVersion, { headers: HEADERS })
}

