
export type StatsViewConfig = {
    songRankCount: number,
    artistRankCount: number    
}

export type StatsData = {
    formatVersion: number,
    songs: SongData[]
}

export type ProcessedStats = {
    topArtists: ArtistData[],
    topSongs: SongData[],
    songCount: number,
    artistCount: number
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

export class StatsProcessor {
    data: StatsData;
    
    constructor(data: StatsData) {
        this.data = data;

        this.data.songs.sort((a, b) => {
            return b.totalPlays - a.totalPlays;
        });
    }

    getResult(config: StatsViewConfig): ProcessedStats {
        return {
            topArtists: this.getArtists(true).slice(0, config.artistRankCount),
            topSongs: this.data.songs.slice(0, config.songRankCount), // NOTE: songs are sorted upon initialization,
            songCount: this.data.songs.length,
            artistCount: this.getArtistNames().length
        };
    }

    // Creates a data clone without songs that don't qualify for display
    getStrippedData(config: StatsViewConfig) {
        const statsResult = this.getResult(config);

        const newData: StatsData = {
            formatVersion: this.data.formatVersion,
            songs: []
        };

        for(const song of statsResult.topSongs) {
            newData.songs.push(song);
        } 

        return newData;
    }

    getArtistNames(): string[] {
        const res: string[] = [];

        for(const song of this.data.songs) {
            if(!res.includes(song.artist)) {
                res.push(song.artist);
            }
        }

        return res;
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

export function parseStatsData(text: string): StatsData {
    let data: any;
    
    try {
        data = JSON.parse(text) as StatsData;
    } catch(e) {
        throw `Invalid file format: ${e}`;
    }
    
    if(typeof(data) == "object" && Array.isArray(data)) {
        throw "Invalid file format: Expected Object got Array for root.";
    }

    if(!data["songs"]) {
        throw "Invalid file format: missing 'songs' field";
    }

    if(!Array.isArray(data["songs"])) {
        throw "Invalid file format: 'songs' must be an array";
    }

    return data;
}
