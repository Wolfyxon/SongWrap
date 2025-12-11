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
    // TODO: Cache

    /* --- Public --- */

    async querySongByName(name: string, artistId?: string): Promise<APISong | undefined> {
        const search = await this.querySongSearch(name, artistId);

        if(!search)
            return;

        return await this.apiSongFromSearchResult(search);
    }

    async queryArtistById(artistId: string): Promise<APIArtist | undefined> {
        const info = await this.queryArtistInfo(artistId);
        
        if(!info)
            return;

        return await this.apiArtistFromInfo(info);
    }

    async queryArtistByName(name: string): Promise<APIArtist | undefined> {
        const search = await this.queryArtistSearch(name);

        if(!search) return;
        
        return await this.queryArtistById(search.id);
    }

    /* --- Private --- */

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
        const res = await this.httpGet(url);

        if(!res.ok) {
            console.warn(`Code ${res.status} from: ${url}`);
            return;
        }
        
        return await res.json();
    }

    /* Song logic */

    private async querySongSearch(searchString: string, artistId?: string): Promise<MBRecordingSearchResult | undefined> {
        searchString = encodeURI(searchString);
        
        let url = `${MUSICBRAINZ}/recording/?query=${searchString}&limit=5`;

        if(artistId) {
            url += "&arid=" + encodeURI(artistId);
        }

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
