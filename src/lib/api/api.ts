import { COVERARCH, type CAARelease, type CAAReleaseImage } from "./coveArtArchive";
import { type MBArtistSearchResult , type MBArtistSearch, MUSICBRAINZ, type MBArtist, type MBRecordingSearchResult, type MBRecordingSearch } from "./musicBrainz";

export type APIArtist = {
    name: string,
    id: string,
    logo?: string
}

export type APISong = {
    title: string,
    id: string,
    coverArt?: string
}

export class SongAPI {
    private songCache: Record<string, APISong[]> = {};
    private artistCache: APIArtist[] = [];

    /* --- Public --- */

    async querySongByName(title: string, artistId?: string): Promise<APISong | undefined> {
        const cached = this.getCachedSongByName(title, artistId);

        if(cached)
            return cached;

        const search = await this.querySongSearch(title, artistId);

        if(!search)
            return;

        const res = await this.apiSongFromSearchResult(search);

        if(!cached && artistId) {
            if(artistId && !this.songCache[artistId]) {
                this.songCache[artistId] = [res];
            } else {
                this.songCache[artistId].push(res);
            }
        }

        return res
    }

    async queryArtistById(artistId: string): Promise<APIArtist | undefined> {
        const cached = this.getCachedArtistById(artistId);

        if(cached)
            return cached;

        const info = await this.queryArtistInfo(artistId);
        
        if(!info)
            return;

        const res = await this.apiArtistFromInfo(info);
        this.cacheArtist(res);

        return res;
    }

    async queryArtistByName(name: string): Promise<APIArtist | undefined> {
        const cached = this.getCachedArtistByName(name);

        if(cached)
            return cached;

        const search = await this.queryArtistSearch(name);

        if(!search) 
            return;
        
        const res = await this.queryArtistById(search.id);

        if(!res)
            return;

        this.cacheArtist(res);

        return res;
    }

    /* --- Private --- */

    /* Cache */

    private cacheArtist(artist: APIArtist) {
        if(this.songCache[artist.id])
            return;

        this.songCache[artist.id] = [];
        this.artistCache.push(artist);
    }

    private getCachedArtistById(id: string): APIArtist | undefined {
        for(const artist of this.artistCache) {
            if(artist.id == id) {
                return artist;
            }
        }
    }

    private getCachedArtistByName(name: string): APIArtist | undefined {
        for(const artist of this.artistCache) {
            if(artist.name == name) {
                return artist;
            }
        }
    }

    private getCachedSongByName(title: string, artistId?: string): APISong | undefined {
        let artists = this.artistCache;

        if(artistId) {
            const artist = this.getCachedArtistById(artistId);

            if(artist) {
                artists = [artist];
            }
        }

        for(const artist of artists) {
            const songs = this.songCache[artist.name];

            if(!songs) 
                return;

            for(const song of songs) {
                if(song.title == title) {
                    return song;
                }
            }
        }

        return;
    }

    
    /* HTTP logic */

    private async httpGet(url: string): Promise<Response> {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        return res;
    }

    private async get<T>(url: string): Promise<T | undefined> {
        try {
            const res = await this.httpGet(url);

            if(!res.ok) {
                console.warn(`Code ${res.status} from: ${url}`);
                return;
            }
            
            return await res.json();
        } catch (e) {
            console.warn("HTTP error", e);
        }
    }

    /* Song logic */

    private async querySongSearch(searchString: string, artistId?: string): Promise<MBRecordingSearchResult | undefined> {
        if(artistId) {
            searchString = " arid:" + artistId;
        }

        let url = `${MUSICBRAINZ}/recording/?query=${encodeURI(searchString)}&limit=5`;

        const search: MBRecordingSearch | undefined = await this.get(url);

        if(!search || !search.recordings)
            return;

        return search.recordings[0];
    }

    private async queryCoverArtData(releaseId: string): Promise<CAARelease | undefined> {
        releaseId = encodeURI(releaseId);
        const data: CAARelease | undefined = await this.get(`${COVERARCH}/release/${releaseId}`);

        return data;
    }

    private async querySongCoverArt(song: MBRecordingSearchResult): Promise<string | undefined> {        
        const release = song.releases[0];

        if(!release)
            return;

        const coverData = await this.queryCoverArtData(release.id);

        if(!coverData)
            return;

        for(const img of coverData.images) {
            if(img.front) {
                return img.image;
            }
        }
    }

    private async apiSongFromSearchResult(searchRes: MBRecordingSearchResult): Promise<APISong> {
        return {
            title: searchRes.name,
            id: searchRes.id,
            coverArt: await this.querySongCoverArt(searchRes)
        };
    }

    /* Artist logic */

    private async queryArtistSearch(searchString: string): Promise<MBArtistSearchResult | undefined> {      
        searchString = encodeURI(searchString);  

        const url = `${MUSICBRAINZ}/artist/?query=${searchString}&alias=${searchString}&limit=5`;
        const search: MBArtistSearch | undefined = await this.get(url);

        if(!search || !search.artists)
            return;
        
        return search.artists[0];
    }

    private async queryArtistInfo(artistId: string): Promise<MBArtist | undefined> {
        const res: MBArtist | undefined = await this.get(`${MUSICBRAINZ}/artist/${artistId}/?inc=url-rels`);

        return res; 
    }

    private async findArtistLogo(artist: MBArtist): Promise<string | undefined> {
        // TODO: Search in other sources. There are barely any artist images in MusicBrainz
        // this function is 'async' to prepare it for making requests in the future
        
        for(const rel of artist.relations) {
            if(rel.type == "image") {
                return rel.url.resource;
            }
        }

        return;
    }

    private async apiArtistFromInfo(artistInfo: MBArtist): Promise<APIArtist> {
        return {
            name: artistInfo.name,
            id: artistInfo.id,
            //logo: await this.findArtistLogo(artistInfo) 
            // the logo logic is highly flawed (URL contains the image page instead of the actual file, barely any artists have an image). Disabled for now
        };
    }
}
