export function getParams(requestUrl: string) {
    const url = new URL(requestUrl)

    const urlParams = new URLSearchParams(url.searchParams)
    const params: Record<string, string> = {}

    for (const [key, value] of urlParams) {
        params[key] = value
    }

    return params
}