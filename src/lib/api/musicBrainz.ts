// https://musicbrainz.org/doc/Development

export const MUSICBRAINZ = "https://musicbrainz.org/ws/2";

export type MBIdentified = {
    id: string
}

export type MBArtistSearchResult = {
    id: string,
    type: string,
    name: string
}

export type MBRelease = {
    id: string,
    status: "Official" | "Unofficial",
    "artist-credit"?: MBArtistCredit[],
}

export type MBRecordingSearchResult = {
    id: string,
    title: string,
    releases: MBRelease[],
    "artist-credit"?: MBArtistCredit[],
}

export type MBSearch = {
    created: string,
    count: number,
    offset: number
}

export type MBArtistSearch = MBSearch & {
    artists?: MBArtistSearchResult[]
}

export type MBRecordingSearch = MBSearch & {
    recordings?: MBRecordingSearchResult[]
}

export type MBArtist = {
    id: string,
    name: string,
    relations?: MBRelation[]
}

export type MBArtistCredit = {
    name: string,
    artist: MBArtist
}

export type MBRelation = {
    type: string,
    "target-type": string,
    url: {
        id: string,
        resource: string
    }
}

