// @ts-nocheck
import { Buffer } from 'node:buffer'
import nacl from 'tweetnacl'


export function signData(payload: any, env: Env) {
    const privateKey = Buffer.from(env.PRIVATE_KEY, 'hex')

    const signature = nacl.sign.detached(Buffer.from(payload), privateKey)

    return {
        signature: Buffer.from(signature).toString('hex')
    }
}