import { useEffect, useState } from 'react';

import { Song } from './Song';
import { UserPlaylists } from './UserPlaylists';
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

  const generatePlaylist = async (id: string) => {
    setLoading(true);

    const playlist = await getPlaylist(id);
    const related = await getRelated(playlist);

    setLoading(false);
    setGenerated(related);
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20,

        marginLeft: 20,
      }}
    >
      {!playlists && <h2>Loading Your Playlists...</h2>}
      {!loading && playlists && !generated && <UserPlaylists playlists={playlists} generatePlaylist={generatePlaylist} />}
      {loading && <h2>Finding Related Music...</h2>}
      {generated && (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30, marginBottom: 14 }}>
            <button onClick={() => setGenerated(undefined)} style={{ marginRight: 30 }}>
              Back
            </button>
            <button onClick={async () => await createPlaylist(generated)}>Save My Playlist</button>
          </div>
          {generated.map((t) => (
            <Song song={t} />
          ))}
        </div>
      )}
    </div>
  );
}
