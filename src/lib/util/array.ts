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
    return array[randi(0, array.length)];
}
