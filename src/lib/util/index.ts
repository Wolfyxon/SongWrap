export function wait(ms: number): Promise<undefined> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function base64encode(text: string): string {
    const bytes = new TextEncoder().encode(text);
    const binStr = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");

    return btoa(binStr);
}

export function base64decode(base64: string): string {
    const bytes = Uint8Array.from(atob(base64), (m) => m.codePointAt(0)!);
    
    return new TextDecoder().decode(bytes);
}