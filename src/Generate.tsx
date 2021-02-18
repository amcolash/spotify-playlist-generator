import { useEffect, useState } from 'react';
import { getUserPlaylists, getPlaylist, getRelated, createPlaylist } from './util';

export function Generate() {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[] | undefined>();

  useEffect(() => {
    getUserPlaylists().then((data) => {
      setPlaylists(data);
    });
  }, []);

  return (
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
                setLoading(true);

                const playlist = await getPlaylist(p.id);
                const related = await getRelated(playlist);

                setLoading(false);
                setGenerated(related);
              }}
            >
              {p.name}
            </div>
          ))}
      {loading && <div>Finding Related Music...</div>}
      {generated && (
        <>
          <button onClick={async () => await createPlaylist(generated)}>Save My Playlist</button>
          {generated.map((t) => (
            <div key={t.id}>
              {t.name} - {t.artists[0].name}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
