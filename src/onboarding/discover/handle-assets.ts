import { ROUTES } from "../../router"

export const REMAP: Record<string, string> = {
    contract: 'contractAddresses',
    contractAddress: 'contractAddresses',
}

const ASSETS = [
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/67773e71-0a53-4fcf-f335-c34aae18b700/raw",
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/9dc016fe-e253-4018-f993-b64c04652200/raw",
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/16d74d8e-8901-4e16-e9f8-2cf95845b900/raw",
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/73dee5f2-2b21-426b-e02c-8e3b92699600/raw",
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/assets/img/alias/ziggurats/raw",
    "https://imagedelivery.net/X6w5bi3ztwg4T4f6LG8s0Q/d59ccc19-894a-4f11-4119-94161e1ed200/raw"
]

export async function handleAssets(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url)
    const assetIndex = pathname.substring(ROUTES.ONBOARDING_DISCOVER_ASSETS.length - 1)

    const index = Number(assetIndex)

    if (!Number.isFinite(index)) {
        return new Response('Malformed URL', { status: 500 })
    }

    if (index < 0 || index > 5) {
        return new Response('Index out of bounds', { status: 500 })
    }

    return Response.redirect(ASSETS[index], 301)
}

