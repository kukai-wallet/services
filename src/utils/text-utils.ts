// @ts-nocheck
import { Buffer } from 'node:buffer'

export function stringToBase64(input: string) {
    return Buffer.from(input).toString('base64')
}