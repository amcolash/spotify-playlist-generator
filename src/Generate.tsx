import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'react-feather';
import Modal from 'react-modal';
import { media, style } from 'typestyle';

import { GeneratedPlaylist } from './GeneratedPlaylist';
import { Loading } from './Loading';
import { Options } from './Options';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, mobile, Colors } from './util';

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
    resultsPerGroup: 5,
    trackSeed: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<SpotifyApi.TrackObjectSimplified[]>();

  useEffect(() => {
    getUserPlaylists().then((data) => setPlaylists(data));
  }, []);

  const generatePlaylist = useCallback(async () => {
    if (!options.playlist) return;

    setIsGenerating(true);

    const playlist = await getPlaylist(options.playlist.id);
    const related = await getRelated(playlist, options);

    setOptions({ ...options, playlist: undefined });
    setGenerated(related);
    setIsGenerating(false);
  }, [options]);

  return (
    <div className={generate}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 30, position: 'relative' }}>
        <button onClick={() => props.logout()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut style={{ marginRight: 10 }} />
            Sign Out
          </div>
        </button>
      </div>

      <Modal
        isOpen={options.playlist !== undefined && !isGenerating && !generated}
        onRequestClose={() => setOptions({ ...options, playlist: undefined })}
        contentLabel="Playlist Generation Options"
        style={{
          content: {
            maxHeight: 'calc(95vh - 40px)',
            background: Colors.Black,
            top: '50%',
            left: '52%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-46%',
            transform: 'translate(-52%, -50%)',
          },
          overlay: { background: 'rgba(30,30,30,0.95)' },
        }}
        bodyOpenClassName="modal-open"
        appElement={document.querySelector('.App') || undefined}
      >
        <Options options={options} setOptions={setOptions} generatePlaylist={generatePlaylist} />
      </Modal>

      {!playlists && <Loading text="Loading Your Playlists" />}
      {!isGenerating && playlists && !generated && <UserPlaylists playlists={playlists} options={options} setOptions={setOptions} />}
      {isGenerating && <Loading text="Finding Related Music" />}
      {generated && <GeneratedPlaylist generated={generated} setGenerated={setGenerated} />}
    </div>
  );
}
