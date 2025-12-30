# SongWrap
A website for showing a summary of your music listening, inspired by Spotify Wrapped.

[Visit the site](https://wolfyxon.github.io/SongWrap)

## Gathering the stats
The following projects can gather the stats:
- [AudaciousStats](https://github.com/Wolfyxon/AudaciousStats): for Audacious media player

You can also make your own project that will do that. See the format specification below.

## Data format
### Unprocessed stats JSON (the stats file)
Ungroupped unprocessed stats. Made to be human readable and for quick modification.

```json
{
   "formatVersion": 1,
   "songs": [
      {
          "title": "Du Hast",
          "artist": "Rammstein",
          "totalPlays": 87
      }
   ]
}
```

- `formatVersion`: (number) Numeric version of the file structure. Made for distinguishing the versions and converting them in case the format changes in future.
- `songs`: (SongData[]) An array of songs
> SongData
> - `title`: (string) Title of the song
> - `artist`: (string) Name of the artist
> - `totalPlays`: (number) Total number of plays 

### Processed stats JSON (encoded in URL as Base64)
Processed, almost ready to display stats. Meant to take less space when more data is present. 
Artists and songs that don't qualify for display are not included.

- `artists`: (ArtistData[]) Array of artists
> ArtistData
> - `name`: (string) Name of the artist
> - `totalPlays`: (number) Number
- - `songs`: (StrippedSongData[]) Array of songs
> StrippedSongData
> - `title`: (string) Title of the song
> - `artist`: (number) Index of the song's artist
> - `totalPlays`: (number) Total amount of plays
- `songCount`: (number) Total number of songs a user has listened to
- `artistCount`: (number) Total number of artists a user has listened to

### URL format
`https://wolfyxon.github.io/SongWrap/?s=<base64 processed stats JSON>`

Example:

https://wolfyxon.github.io/SongWrap/?s=eyJzb25ncyI6W3sidGl0bGUiOiJCZWhvbGQgdGhlIHNrZWxldG9uIiwiYXJ0aXN0IjoiS2Fyb2xldXNQTCIsInRvdGFsUGxheXMiOjQyfSx7InRpdGxlIjoiR2lmdGlnIiwiYXJ0aXN0IjoiUmFtbXN0ZWluIiwidG90YWxQbGF5cyI6MzV9LHsidGl0bGUiOiJBbiBBYnNlbmNlIiwiYXJ0aXN0IjoiSGVhdmVuIFBpZXJjZSBIZXIiLCJ0b3RhbFBsYXlzIjozMH0seyJ0aXRsZSI6IkJJRyBTSE9UIiwiYXJ0aXN0IjoiVG9ieSBGb3giLCJ0b3RhbFBsYXlzIjoxN31dLCJhcnRpc3RzIjpbeyJuYW1lIjoiS2Fyb2xldXNQTCIsInRvdGFsUGxheXMiOjU3fSx7Im5hbWUiOiJSYW1tc3RlaW4iLCJ0b3RhbFBsYXlzIjo1N30seyJuYW1lIjoiSGVhdmVuIFBpZXJjZSBIZXIiLCJ0b3RhbFBsYXlzIjo0Nn1dLCJ0b3BBcnRpc3RzIjpbMCwxLDJdLCJ0b3BTb25ncyI6WzAsMSwyLDNdLCJzb25nQ291bnQiOjIyLCJhcnRpc3RDb3VudCI6MTR9
