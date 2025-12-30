import { base64decodeString, base64encodeString } from "./util/string"

export type StatsViewConfig = {
    songRankCount: number,
    artistRankCount: number    
}

export type StatsData = {
    formatVersion: number,
    songs: SongData[]
}

export type ProcessedStatsData = {
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

export class ProcessedStats {
    data: ProcessedStatsData;

    constructor(data: ProcessedStatsData) {
        this.data = data;
    }

    static parse(text: string): ProcessedStats {
        const data = JSON.parse(text);

        // TODO: Validate the JSON structure

        return new ProcessedStats(data as ProcessedStatsData);
    }

    static fromBase64(base64: string): ProcessedStats {
        const text = base64decodeString(base64);
        return this.parse(text);
    }
 
    toBase64(): string {
        return base64encodeString(JSON.stringify(this.data));
    }
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
        const data = {
            topArtists: this.getArtists(true).slice(0, config.artistRankCount),
            topSongs: this.getSongs().slice(0, config.songRankCount), // NOTE: songs are sorted upon initialization,
            songCount: this.data.songs.length,
            artistCount: this.getArtistNames().length
        };

        return new ProcessedStats(data);
    }

    // Creates a data clone without songs that don't qualify for display
    getStrippedData(config: StatsViewConfig) {
        const statsResult = this.getResult(config);

        const newData: StatsData = {
            formatVersion: this.data.formatVersion,
            songs: []
        };

        for(const song of statsResult.data.topSongs) {
            newData.songs.push(song);
        } 

        return newData;
    }

    // Gets songs but removes the sensitive 'path' property
    getSongs(): SongData[] {
        return this.data.songs.map((v) => {
            const song = { ...v };
            song.path = undefined;

            return song;
        });
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
