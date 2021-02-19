import { useEffect, useState } from 'react';
import { Check, LogOut } from 'react-feather';
import { media, style } from 'typestyle';
import { Loading } from './Loading';
import { Options } from './Options';

import { Song } from './Song';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, createPlaylist, mobile } from './util';

const generate = style(
  {
    height: 'calc(100% - 40px)',
    width: 'calc(100% - 40px)',
    maxWidth: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
  },
  media(mobile, { paddingBottom: 55 })
);

export interface GenerateOptions {
  shuffle: boolean;
  resultsPerGroup: number;
  trackSeed: boolean;
  playlist?: SpotifyApi.PlaylistObjectSimplified;
}

export function Generate(props: { logout: () => void }) {
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>();

  const [options, setOptions] = useState<GenerateOptions>({
    shuffle: false,
    resultsPerGroup: 10,
    trackSeed: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[]>();
  const [playlistLink, setPlaylistLink] = useState<string>();

  useEffect(() => {
    getUserPlaylists().then((data) => setPlaylists(data));
  }, []);

  const generatePlaylist = async () => {
    if (!options.playlist) return;

    setIsGenerating(true);

    const playlist = await getPlaylist(options.playlist.id);
    const related = await getRelated(playlist, options);

    setGenerated(related);
    setIsGenerating(false);
  };

  return (
    <div className={generate}>
      <button onClick={() => props.logout()} style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LogOut style={{ marginRight: 10 }} />
          Sign Out
        </div>
      </button>

      {options.playlist && !isGenerating && !generated && (
        <Options options={options} setOptions={setOptions} generatePlaylist={generatePlaylist} />
      )}

      {!playlists && <Loading text="Loading Your Playlists" />}
      {!isGenerating && playlists && !generated && <UserPlaylists playlists={playlists} options={options} setOptions={setOptions} />}
      {isGenerating && <Loading text="Finding Related Music" />}
      {generated && (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 14 }}>
            <button onClick={() => setGenerated(undefined)} style={{ marginRight: 30 }}>
              Back
            </button>
            {playlistLink && (
              <button onClick={() => window.open(playlistLink, '_blank')}>
                <Check /> Open Playlist
              </button>
            )}
            {!playlistLink && <button onClick={async () => await createPlaylist(generated, setPlaylistLink)}>Save My Playlist</button>}
          </div>
          {generated.map((t) => (
            <Song key={t.id} song={t} />
          ))}
        </div>
      )}
    </div>
  );
}
