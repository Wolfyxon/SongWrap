
export type Stats = {
    formatVersion: number,
    songs: Song[]
}

export type Song = {
    path?: string,
    title: string,
    artist: string
}
