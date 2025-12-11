export const COVERARCH = "https://coverartarchive.org";


export type CAARelease = {
    images: CAAReleaseImage[]
}


export type CAAReleaseImage = {
    front: boolean,
    id: string,
    image: string,

    thumbnails: {
        small?: string,
        large?: string
    },

    types: string[],
    approved: boolean,
    back: boolean
}
