import { randi } from "./math";

export function shareValues(a: any[], b: any[]): boolean {
    for(const value of a) {
        if(b.includes(value)) {
            return true;
        }
    }

    return false;
}

export function randChoice<T>(array: T[]): T | undefined {
    return array[randi(0, array.length - 1)];
}

export function valuesToIndices(array: any[], values: any[]): number[] {
    const res: number[] = [];

    for(const val of values) {
        const idx = array.indexOf(val);

        if(idx != -1) {
            res.push(idx);
        }
    }

    return res;
}

export function indicesToValues<T>(array: T[], indices: number[]): T[] {
    const res: T[] = [];

    for(const idx of indices) {
        const val = array[idx];

        if(val !== undefined) {
            res.push(val);
        }
    }

    return res;
}