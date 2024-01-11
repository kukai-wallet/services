import { Env } from "../../worker-configuration"
import { signData } from "./encrypt"
import { getParams } from "./param-utils"
import { stringToBase64 } from "./text-utils"

export enum VERSIONS {
    V1 = "/v1/",
    V2 = "/v2/"
}

const ENCODE_ENABLED_OPTIONS = new Set(["", "true"])

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
        console.log('after encoding::', encodedData)
        displayData = encodedData
    }

    const { signature } = signData(encodedData, env)

    return {
        data: displayData,
        signature,
    }
}