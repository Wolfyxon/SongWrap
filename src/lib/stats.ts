import { indicesToValues, pushAllIfMissing, pushIfMissing, valuesToIndices } from "./util/array";
import { base64decodeString, base64encodeString } from "./util/string";

interface PlayCounted {
    totalPlays: number;
}

export type StatsViewConfig = {
    songRankCount: number,
    artistRankCount: number,
    songObsessionCount: number
}

export type StatsData = {
    formatVersion: number,
    songs: SongData[]
}

export type ProcessedStatsData = {
    songs: StrippedSongData[],
    artists: ArtistData[],
    songsByObsession: number[],
    songCount: number,
    artistCount: number
}

export type SongData = {
    path?: string,
    title: string,
    artist: string,
    totalPlays: number,
    firstPlay?: number,
    lastPlay?: number
}

export type StrippedSongData = {
    title: string,
    artist: number, // artist index
    totalPlays: number,
    /*firstPlay: number,
    lastPlay: number*/
}

export type ArtistData = {
    name: string,
    totalPlays: number
}

const DEFAULT_CONFIG: StatsViewConfig = {
    songRankCount: 4,
    artistRankCount: 3,
    songObsessionCount: 1
};

export class ProcessedStats {
    data: ProcessedStatsData;
    config: StatsViewConfig;

    constructor(data: ProcessedStatsData, config: StatsViewConfig = DEFAULT_CONFIG) {
        this.data = data;
        this.config = config;
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
            artist: this.data.artists[song.artist]?.name ?? "unknown",
            lastPlay: 0,
            firstPlay: 0
        }
    }

    getTopSongs(count?: number): SongData[] {
        return this.data.songs.slice(0, count ?? this.config.songRankCount).map((s) => this.unstripSong(s));
    }

    getTopArtists(count?: number): ArtistData[] {
        return this.data.artists.slice(0, count ?? this.config.artistRankCount);
    }

    getSongsByObsession(): SongData[] {
        return indicesToValues(this.data.songs, this.data.songsByObsession).map((s) => this.unstripSong(s))
    }
}

export class StatsProcessor {
    data: StatsData;
    
    constructor(data: StatsData) {
        this.data = data;

        StatsProcessor.sortByTotalPlays(this.data.songs);
    }

    static sortByTotalPlays(array: PlayCounted[]): PlayCounted[] {
        return array.sort((a, b) => b.totalPlays - a.totalPlays);
    }

    getSongObsessionRatio(song: SongData): number {
        if(song.firstPlay === undefined || song.lastPlay === undefined) {
            return 0;
        }

        const dayDuration = 60 * 60 * 24;
        const timeSinceLastPlay = song.lastPlay - song.firstPlay;
        const daysSinceLastPlay = timeSinceLastPlay / dayDuration;
        const recency = 1 / (1 + daysSinceLastPlay);

        return song.totalPlays * recency;
    }

    stripSong(song: SongData, artistNames: string[]): StrippedSongData {
        return {
            ...song,
            artist: artistNames.indexOf(song.artist),
        }
    }

    getArtistsOfSongs(songs: SongData[], artists?: ArtistData[]): ArtistData[] {
        artists = artists ?? this.getArtists(true);
        
        const res: ArtistData[] = [];

        for(const song of songs) {
            for(const artist of artists) {
                if(artist.name == song.artist) {
                    pushIfMissing(res, artist);
                }
            }
        }

        return res;
    }

    getResult(config: StatsViewConfig = DEFAULT_CONFIG): ProcessedStats {
        const topSongs = this.getSongs().slice(0, config.songRankCount);
        const obsessiveSongs = this.getSongsByObsession(config.songObsessionCount);

        const songs = topSongs;
        pushAllIfMissing(songs, obsessiveSongs);
        StatsProcessor.sortByTotalPlays(songs);

        const artists = this.getArtistsOfSongs(songs);
        StatsProcessor.sortByTotalPlays(artists);

        const artistNames: string[] = artists.map((a) => a.name);

        const data = {
            songs: songs.map((s) => this.stripSong(s, artistNames)),
            artists: artists,
            songCount: this.data.songs.length,
            artistCount: this.getArtistNames().length,
            songsByObsession: valuesToIndices(songs, obsessiveSongs)
        };

        return new ProcessedStats(data);
    }

    getSongsByObsession(max?: number): SongData[] {
        const songs = [ ...this.data.songs];
        
        songs.sort((a, b) => {
            return this.getSongObsessionRatio(b) - this.getSongObsessionRatio(a);
        });

        if(max) {
            return songs.slice(0, max);
        }

        return songs;
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
