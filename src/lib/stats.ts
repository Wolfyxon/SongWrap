import { indicesToValues, valuesToIndices } from "./util/array"
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
    songs: StrippedSongData[],
    artists: ArtistData[],
    topArtists: number[],
    topSongs: number[],
    songCount: number,
    artistCount: number
}

export type SongData = {
    path?: string,
    title: string,
    artist: string,
    totalPlays: number
}

export type StrippedSongData = {
    title: string,
    artist: number, // artist index
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

    unstripSong(song: StrippedSongData): SongData {
        return {
            ...song,
            artist: this.data.artists[song.artist]?.name ?? "unknown"
        }
    }

    getTopSongs(): SongData[] {
        return indicesToValues(this.data.songs, this.data.topSongs).map((s) => this.unstripSong(s));
    }

    getTopArtists(): ArtistData[] {
        return indicesToValues(this.data.artists, this.data.topArtists);
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

    stripSong(song: SongData, artistNames: string[]): StrippedSongData {
        return {
            ...song,
            artist: artistNames.indexOf(song.artist),
        }
    }

    getResult(config: StatsViewConfig): ProcessedStats {
        const topArtists = this.getArtists(true).slice(0, config.artistRankCount);
        const topSongs = this.getSongs().slice(0, config.songRankCount);  // NOTE: songs are sorted upon initialization,

        const artists = topArtists;
        const songs = topSongs;

        const artistNames: string[] = artists.map((a) => a.name);

        const data = {
            songs: songs.map((s) => this.stripSong(s, artistNames)),
            artists: artists,

            topArtists: valuesToIndices(topArtists, artists),
            topSongs: valuesToIndices(topSongs, songs),
            songCount: this.data.songs.length,
            artistCount: this.getArtistNames().length
        };

        return new ProcessedStats(data);
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
