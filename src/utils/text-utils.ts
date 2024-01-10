export function stringToHex(input: string) {
    let hex
    let result = ""

    for (let i = 0; i < input.length; i++) {
        hex = input.charCodeAt(i).toString(16)
        result += ("000" + hex).slice(-4)
    }

    return result
}