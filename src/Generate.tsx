import { useCallback, useEffect, useState } from 'react';
import { Check, LogOut, Volume2, VolumeX } from 'react-feather';
import Modal from 'react-modal';
import { media, style } from 'typestyle';

import { Loading } from './Loading';
import { Options } from './Options';

import { Song } from './Song';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, createPlaylist, mobile, Colors } from './util';

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

const back = style(
  {
    margin: '0 10px',
  },
  media(mobile, { margin: '10px 40px 36px' })
);

const buttonInput = style(
  {
    margin: '0 10px',
  },
  media(mobile, { margin: '10px 40px' })
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

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlistLink, setPlaylistLink] = useState<string>();

  const [audioPreview, setAudioPreview] = useState(true);

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
      <div style={{ display: 'flex', width: '100%', marginBottom: 30, position: 'relative' }}>
        <div style={{ flex: 1 }} />
        <button onClick={() => props.logout()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut style={{ marginRight: 10 }} />
            Sign Out
          </div>
        </button>
        <div style={{ flex: 1 }} />

        {generated && (
          <button className="noButton" onClick={() => setAudioPreview(!audioPreview)} style={{ position: 'absolute', top: 0, right: 0 }}>
            {audioPreview ? <Volume2 className="iconButton" /> : <VolumeX className="iconButton" />}
          </button>
        )}
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
      {generated && (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px 0' }}>
            <button
              className={back}
              onClick={() => {
                setGenerated(undefined);
                setPlaylistLink(undefined);
                setNewPlaylistName('');
              }}
            >
              Back
            </button>
            {!playlistLink && (
              <input
                className={buttonInput}
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New Playlist Name"
                style={{ borderRadius: 6, border: 'none', padding: 8 }}
              />
            )}
            {playlistLink && (
              <button
                className={buttonInput}
                onClick={() => window.open(playlistLink, '_blank')}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Check style={{ margin: '0 10px' }} /> Open Playlist
              </button>
            )}
            {!playlistLink && (
              <button
                className={buttonInput}
                disabled={newPlaylistName.length === 0}
                onClick={async () => await createPlaylist(generated, setPlaylistLink, newPlaylistName)}
              >
                Save New Playlist
              </button>
            )}
          </div>
          {generated.map((t) => (
            <Song key={t.id} song={t} generated={generated} setGenerated={setGenerated} audioPreview={audioPreview} />
          ))}
        </div>
      )}
    </div>
  );
}
