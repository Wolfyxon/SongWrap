export function capitalize(text: string): string {
    if(text.length == 0) {
        return text;
    }
    
    const split = text.split("");
    split[0] = split[0].toUpperCase();

    return split.join("");
}

export function removeUrlParams(url: string): string {
    const split = url.split("?");

    return split[0];
}

/* base64 */
export function base64EncodeBytes(bytes: Uint8Array): string {
    const binStr = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");

    return btoa(binStr);
}

export function base64DecodeBytes(base64: string): Uint8Array {
    const bytes = Uint8Array.from(atob(base64), (m) => m.codePointAt(0)!);

    return bytes;
}

export function base64encodeString(text: string): string {
    const bytes = new TextEncoder().encode(text);

    return base64EncodeBytes(bytes);
}

export function base64decodeString(base64: string): string {
    const bytes = base64DecodeBytes(base64);
    
    return new TextDecoder().decode(bytes);
}
