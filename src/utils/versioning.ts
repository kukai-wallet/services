import { Env } from "../../worker-configuration"
import { signData } from "./encrypt"
import { stringToHex } from "./text-utils"

export enum VERSIONS {
    V1 = "/v1/",
    V2 = "/v2/"
}

export function makeResponsePayload(payload: any, version: VERSIONS, env: Env) {
    if (version === VERSIONS.V1) {
        return payload
    }

    const hexData = stringToHex(payload)

    const { signature } = signData(hexData, env)

    return {
        data: JSON.parse(payload),
        hexData,
        signature,
    }
}