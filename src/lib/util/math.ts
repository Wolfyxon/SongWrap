
export function randf(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randi(min: number, max: number): number {
    return Math.round(randf(min, max));
}