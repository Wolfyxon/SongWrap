
export type StatsData = {
    formatVersion: number,
    songs: SongData[]
}

export type SongData = {
    path?: string,
    title: string,
    artist: string,
    totalPlays: number
}

export class Stats {
    data: StatsData;
    
    constructor(data: StatsData) {
        this.data = data;

        this.data.songs.sort((a, b) => {
            return b.totalPlays - a.totalPlays;
        });
    }

    getArtistOccurrence(): Record<string, number> {
        const res: Record<string, number> = {};

        for(const song of this.data.songs) {
            if(!res[song.artist]) {
                res[song.artist] = 0;
            }

            res[song.artist] += 1;
        }

        return res;
    }
}
