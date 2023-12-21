import { signData } from "./encrypt"

export enum VERSIONS {
    V1 = "/v1/",
    V2 = "/v2/"
}

export function makeResponsePayload(payload: any, version: VERSIONS) {
    if (version === VERSIONS.V1) {
        return payload
    }

    const { signature, publicKey } = signData(payload)

    return {
        data: JSON.parse(payload),
        publicKey,
        signature,
    }
}