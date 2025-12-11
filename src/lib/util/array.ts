export function shareValues(a: any[], b: any[]): boolean {
    for(const value of a) {
        if(b.includes(value)) {
            return true;
        }
    }

    return false;
}
