import { media, style } from 'typestyle';
import { Playlist } from './Playlist';
import { mobile } from './util';

const header = style(
  {
    marginLeft: 8,
    marginTop: 12,
  },
  media(mobile, { textAlign: 'center' })
);

export function UserPlaylists(props: { playlists: SpotifyApi.PlaylistObjectSimplified[]; generatePlaylist: (id: string) => void }) {
  return (
    <div style={{ width: '100%' }}>
      <h2 className={header}>Choose a Playlist</h2>
      {props.playlists
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => p.name && p.name.length > 0 && <Playlist key={p.id} playlist={p} generatePlaylist={props.generatePlaylist} />)}
    </div>
  );
}
