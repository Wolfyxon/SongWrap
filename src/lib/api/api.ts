import { shareValues } from "$lib/util/array";
import { COVERARCH, type CAARelease, type CAAReleaseImage } from "./coveArtArchive";
import { type MBArtistSearchResult , type MBArtistSearch, MUSICBRAINZ, type MBArtist, type MBRecordingSearchResult, type MBRecordingSearch, type MBRelease, type MBArtistCredit } from "./musicBrainz";

export type APIArtist = {
    name: string,
    id: string,
    logo?: string,
}

export type APISong = {
    title: string,
    id: string,
    artistIds: string[],
    coverArt?: string
}

export class SongAPI {
    private songCache: APISong[] = [];
    private artistCache: APIArtist[] = [];
    private offline = false;
    private httpAborts: AbortController[] = [];

    /* --- Public --- */

    setOffline(state: boolean) {
        this.offline = state;

        if(!state) {
            for(const controller of this.httpAborts) {
                controller.abort();
            }

            this.httpAborts = [];
        }
    }

    isOffline(): boolean {
        return this.offline;
    }

    async querySongByName(title: string, artistId?: string): Promise<APISong | undefined> {
        const cached = this.getCachedSongByName(title, artistId);

        if(cached)
            return cached;

        const search = await this.querySongSearch(title, artistId);

        if(!search)
            return;

        const res = await this.apiSongFromSearchResult(search);

        if(!cached) {
            this.cacheSong(res);
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
        
        if(!cached) {
            this.cacheArtist(res);
        }

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

        if(!cached) {
            this.cacheArtist(res);
        }

        return res;
    }

    /* --- Private --- */

    /* Cache */

    private cacheArtist(artist: APIArtist) {
        this.artistCache.push(artist);
    }

    private cacheSong(song: APISong) {
        this.songCache.push(song);
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
        for(const song of this.songCache) {
            if(song.title == title) {
                if(artistId && !song.artistIds.includes(artistId)) {
                    continue;
                }

                return song;
            }
        }
    }

    
    /* HTTP logic */

    private async httpGet(url: string): Promise<Response> {
        const controller = new AbortController();
        const timeout = 5000;
        
        this.httpAborts.push(controller);
        
        const complete = () => { // 'function' doesn't have access to private fields
            const idx = this.httpAborts.indexOf(controller);
            
            if(!idx)
                return;

            controller.abort();
            this.httpAborts.splice(idx, 1);
        }

        setTimeout(complete, timeout);

        const res = await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
                "Accept": "application/json"
            }
        });

        return res;
    }

    private async get<T>(url: string): Promise<T | undefined> {
        if(this.isOffline())
            return;

        try {
            const res = await this.httpGet(url);

            if(!res.ok) {
                console.warn(`Code ${res.status} from: ${url}`);
                return;
            }
            
            return await res.json();
        } catch (e) {
            console.warn("HTTP error", e, url);
        }
    }

    /* Song logic */

    private async querySongSearch(searchString: string, artistId?: string): Promise<MBRecordingSearchResult | undefined> {
        if(artistId) {
            const artist = await this.queryArtistById(artistId);

            if(artist) {
                // Searching by name seems to be more accurate
                searchString += " artist:" + artist.name;
            } else {
                searchString += " arid:" + artistId;
            }
        }

        let url = encodeURI(
            `${MUSICBRAINZ}/recording/?query=${searchString} status:Official&limit=5`
        );
        
        const search: MBRecordingSearch | undefined = await this.get(url);
        
        if(!search || !search.recordings)
            return;

        return search.recordings[0];
    }

    private async querySongCoverArt(song: MBRecordingSearchResult): Promise<string | undefined> {
        for(let i = 0; i < song.releases.length && i < 5; i++) {
            const rel = song.releases[i];
            const sizes = ["-small", "-250", "-500", ""]

            try {
                for(const size of sizes) {
                    const url = `${COVERARCH}/release/${rel.id}/front${size}`;
                    const image = await this.httpGet(url);

                    if(image.ok)
                        return url;
                    }
            } catch {

            }
        }
    }

    private async apiSongFromSearchResult(searchRes: MBRecordingSearchResult): Promise<APISong> {
        return {
            title: searchRes.title,
            id: searchRes.id,
            artistIds: this.getArtistIdsFromCredits(searchRes["artist-credit"]),
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
        
        if(!artist.relations)
            return;

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

    private getArtistIdsFromCredits(credits: MBArtistCredit[] | undefined): string[] {
        const res: string[] = [];

        if(!credits) {
            return [];
        }

        for(const artist of credits) {
            res.push(artist.artist.id);
        }

        return res;
    }

    private shareCredits(a: MBArtistCredit[], b: MBArtistCredit[]) {
        const aIds = this.getArtistIdsFromCredits(a);
        const bIds = this.getArtistIdsFromCredits(b);
        
        return shareValues(a, b);
    }
}
