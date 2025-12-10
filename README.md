# SongWrap
A website for showing a summary of your music listening, inspired by Spotify Wrapped.

[Visit the site](https://wolfyxon.github.io/SongWrap)

## Gathering the stats
The following projects can gather the stats:
- [AudaciousStats](https://github.com/Wolfyxon/AudaciousStats): for Audacious media player

You can also make your own project that will do that. See the format specification below.

## Data format
This is an example stat file:

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
