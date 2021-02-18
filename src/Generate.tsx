import { useEffect, useState } from 'react';
import { style } from 'typestyle';
import { Loading } from './Loading';

import { Song } from './Song';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, createPlaylist } from './util';

const generate = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: 20,
  marginLeft: 20,
});

export function Generate() {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[]>();

  useEffect(() => {
    getUserPlaylists().then((data) => setPlaylists(data));
  }, []);

  const generatePlaylist = async (id: string) => {
    setIsGenerating(true);

    const playlist = await getPlaylist(id);
    const related = await getRelated(playlist);

    setGenerated(related);
    setIsGenerating(false);
  };

  return (
    <div className={generate}>
      {!playlists && <Loading text="Loading Your Playlists" />}
      {!isGenerating && playlists && !generated && <UserPlaylists playlists={playlists} generatePlaylist={generatePlaylist} />}
      {isGenerating && <Loading text="Finding Related Music" />}
      {generated && (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60, marginBottom: 14 }}>
            <button onClick={() => setGenerated(undefined)} style={{ marginRight: 30 }}>
              Back
            </button>
            <button onClick={async () => await createPlaylist(generated)}>Save My Playlist</button>
          </div>
          {generated.map((t) => (
            <Song key={t.id} song={t} />
          ))}
        </div>
      )}
    </div>
  );
}
