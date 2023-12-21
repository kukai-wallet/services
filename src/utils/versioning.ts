import { Env } from "../../worker-configuration"
import { signData } from "./encrypt"

export enum VERSIONS {
    V1 = "/v1/",
    V2 = "/v2/"
}

export function makeResponsePayload(payload: any, version: VERSIONS, env: Env) {
    if (version === VERSIONS.V1) {
        return payload
    }

    const { signature } = signData(payload, env)

    return {
        data: JSON.parse(payload),
        signature,
    }
}