import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

// Uff, that is a bit generic ;)
async function paginationHelper<T>(
  getData: (
    page: number
  ) => Promise<{
    body: {
      items: T[];
      next: string | null;
    };
  }>
): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    const allData: T[] = [];
    let page = 0;

    while (page >= 0) {
      const data = await getData(page);
      allData.push(...(data.body.items as any[]));

      page = data.body.next ? page + 1 : -1;
    }

    resolve(allData);
  });
}

async function getUserPlaylists(spotify: SpotifyWebApi): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
  return paginationHelper((page: number) => spotify.getUserPlaylists({ limit: 50, offset: page * 50 }));
}

async function getPlaylist(id: string, spotify: SpotifyWebApi): Promise<SpotifyApi.PlaylistTrackObject[]> {
  return paginationHelper((page: number) => spotify.getPlaylistTracks(id, { limit: 100, offset: page * 100 }));
}

async function getRelated(playlist: SpotifyApi.PlaylistTrackObject[], spotify: SpotifyWebApi): Promise<SpotifyApi.TrackObjectSimplified[]> {
  return new Promise(async (resolve, reject) => {
    const related: SpotifyApi.TrackObjectSimplified[] = [];

    let tracks = '';
    for (let i = 1; i <= playlist.length; i++) {
      tracks += playlist[i - 1].track.id + (i % 5 !== 0 ? ',' : '');

      if (i % 5 === 0) {
        const rec = await spotify.getRecommendations({ seed_tracks: tracks, limit: 10 });

        // Ensure there are no duplicated. Can't use a Set here since {} !== {}
        rec.body.tracks.forEach((t) => {
          const found = related.findIndex((f) => f.id === t.id);
          if (found === -1) related.push(t);
        });

        tracks = '';
      }
    }

    resolve(related);
  });
}

export function Playlists(props: { accessToken: string }) {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[] | undefined>();
  const [loading, setloading] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[] | undefined>();

  useEffect(() => {
    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(props.accessToken);

    getUserPlaylists(spotify).then((data) => {
      setPlaylists(data);
    });
  }, [props.accessToken]);

  return (
    <div>
      <h2>Playlists</h2>
      <div>
        {!playlists && <div>Loading Your Playlists...</div>}
        {!loading &&
          playlists &&
          !generated &&
          playlists
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((p) => (
              <div
                key={p.id}
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  setloading(true);

                  const spotify = new SpotifyWebApi();
                  spotify.setAccessToken(props.accessToken);

                  const playlist = await getPlaylist(p.id, spotify);
                  const related = await getRelated(playlist, spotify);

                  setloading(false);
                  setGenerated(related);
                }}
              >
                {p.name}
              </div>
            ))}
        {loading && <div>Finding Related Music...</div>}
        {generated && (
          <>
            <button
              onClick={async () => {
                const spotify = new SpotifyWebApi();
                spotify.setAccessToken(props.accessToken);

                const name = prompt('Name of playlist?');
                if (!name || name.length === 0) return;

                const p = await spotify.createPlaylist(name);

                for (let i = 0; i < generated.length; i += 100) {
                  await spotify.addTracksToPlaylist(
                    p.body.id,
                    generated.slice(i, i + 100).map((t) => t.uri)
                  );
                }

                window.open(p.body.external_urls.spotify, '_blank');
              }}
            >
              Save My Playlist
            </button>
            {generated.map((t) => (
              <div key={t.id}>
                {t.name} - {t.artists[0].name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
