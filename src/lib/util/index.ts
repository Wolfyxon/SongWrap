import { Random } from "./math";

export function wait(ms: number): Promise<undefined> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function getStringColor(text: string): string {
    const rng = Random.fromStringSeed(text);

    const h = Math.floor(rng.nextRange(0, 360));
    const s = Math.floor(rng.nextRange(60, 75));
    const l = Math.floor(rng.nextRange(50, 65));

    return `hsl(${h}, ${s}%, ${l}%)`;
}
