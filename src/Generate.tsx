import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'react-feather';
import { media, style } from 'typestyle';

import { CustomModal } from './CustomModal';
import { GeneratedPlaylist } from './GeneratedPlaylist';
import { Loading } from './Loading';
import { Options } from './Options';
import { Tutorial } from './Tutorial';
import { UserPlaylists } from './UserPlaylists';
import { getUserPlaylists, getPlaylist, getRelated, mobile } from './util';

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
  media(mobile, { paddingBottom: 55, padding: 10, height: 'calc(100% - 20px)', width: 'calc(100% - 20px)' })
);

export interface GenerateOptions {
  shuffle: boolean;
  resultsPerGroup: number;
  trackSeed: boolean;
  playlist?: SpotifyApi.PlaylistObjectSimplified;
}

export function Generate(props: { logout: () => void }) {
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('spotifyTutorial'));
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

  const closeTutorial = useCallback(() => {
    setShowTutorial(false);

    // Just in case I ever want fancier tutorials
    localStorage.setItem('spotifyTutorial', JSON.stringify({ 1: true }));
  }, []);

  return (
    <div className={generate}>
      {/* Logout buton */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 10, marginBottom: 30, position: 'relative' }}>
        <button onClick={() => props.logout()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogOut style={{ marginRight: 10 }} />
            Sign Out
          </div>
        </button>
      </div>

      {/* Options Modal */}
      <CustomModal
        modalOptions={{
          isOpen: options.playlist !== undefined && !isGenerating && !generated,
          onRequestClose: () => setOptions({ ...options, playlist: undefined }),
          contentLabel: 'Playlist Generation Options',
        }}
        title="Playlist Generation Options"
      >
        <Options options={options} setOptions={setOptions} generatePlaylist={generatePlaylist} />
      </CustomModal>

      {/* Tutorial Modal */}
      <CustomModal
        modalOptions={{
          isOpen: showTutorial,
          onRequestClose: closeTutorial,
          contentLabel: 'DiscoList Welcome Info',
        }}
        title="Welcome to DiscoList!"
      >
        <Tutorial closeTutorial={closeTutorial} />
      </CustomModal>

      {!playlists && <Loading text="Loading Your Playlists" />}
      {!isGenerating && playlists && !generated && <UserPlaylists playlists={playlists} options={options} setOptions={setOptions} />}
      {isGenerating && <Loading text="Finding Related Music" />}
      {generated && <GeneratedPlaylist generated={generated} setGenerated={setGenerated} />}
    </div>
  );
}
