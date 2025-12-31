
// NOTE: This is not any good random alg, it's just for basic things that require a seed
export class Random {
    seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    static fromStringSeed(str: string) {
        let seed = 0;

        for(let i = 0; i < str.length; i++) {
            seed += str.charCodeAt(i);
        }

        return new Random(seed);
    }

    next(): number {
        const n = Math.sin(this.seed++) * 10000;
        return n - Math.floor(n);
    }

    nextRange(min: number, max: number): number {
        const rand = this.next();

        return min + rand * (max - min);
    }
}

export function randf(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randi(min: number, max: number): number {
    return Math.round(randf(min, max));
}