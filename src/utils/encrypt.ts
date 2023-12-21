// @ts-nocheck
import { Buffer } from 'node:buffer'
import nacl from 'tweetnacl'

export function signData(payload: any) {
    const { publicKey, secretKey } = nacl.sign.keyPair()

    const signature = nacl.sign.detached(Buffer.from(JSON.stringify(payload)), secretKey)

    return {
        publicKey: Buffer.from(publicKey).toString('hex'),
        signature: Buffer.from(signature).toString('hex')
    }
}