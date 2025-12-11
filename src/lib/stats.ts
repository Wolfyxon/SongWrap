
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

export type ArtistData = {
    name: string,
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

    getArtists(sort: boolean = false) {
        const artistEntries: Record<string, ArtistData> = {}
        const res: ArtistData[] = [];

        for(const song of this.data.songs) {
            const artistId = song.artist.toLowerCase().trim();
            
            if(!artistEntries[artistId]) {
                artistEntries[artistId] = {
                    name: song.artist,
                    totalPlays: song.totalPlays
                }
            } else {
                const artist = artistEntries[artistId];

                artist.totalPlays += song.totalPlays;
            }
        }

        Object.entries(artistEntries).forEach(([id, data]) => {
            res.push(data);
        });

        if(sort) {
            res.sort((a, b) => b.totalPlays - a.totalPlays);
        }

        return res;
    }
}
