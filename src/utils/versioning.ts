import { Env } from "../../worker-configuration"
import { signData } from "./encrypt"
import { getParams } from "./param-utils"
import { stringToBase64 } from "./text-utils"

export enum VERSIONS {
    V1 = "/v1/",
    V2 = "/v2/",
    V3 = "/v3/",
    V4 = "/v4/",
}

export enum NETWORK {
    MAINNET = 'mainnet',
    GHOSTNET = 'ghostnet',
}

const ENCODE_ENABLED_OPTIONS = new Set(["", "true"])

export function getNetwork(url: string) {
    const { hostname } = new URL(url)
    return hostname.includes(NETWORK.GHOSTNET)
        ? NETWORK.GHOSTNET
        : NETWORK.MAINNET
}

export function getVersion(rawUrl: string) {
    const url = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl
    const paths = url.split("/")
    return `/${paths[paths.length - 2]}/` as VERSIONS
}

export function makeResponsePayload(payload: any, version: VERSIONS, env: Env, requestUrl: string) {
    if (version === VERSIONS.V1) {
        return payload
    }

    const { encode } = getParams(requestUrl)
    const shouldEncode = ENCODE_ENABLED_OPTIONS.has(encode)

    let encodedData = payload
    let displayData = JSON.parse(payload)

    if (shouldEncode) {
        encodedData = stringToBase64(encodedData)
        displayData = encodedData
    }

    const { signature } = signData(encodedData, env)

    return {
        data: displayData,
        signature,
    }
}