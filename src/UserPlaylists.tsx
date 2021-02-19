import { Playlist } from './Playlist';

export function UserPlaylists(props: { playlists: SpotifyApi.PlaylistObjectSimplified[]; generatePlaylist: (id: string) => void }) {
  return (
    <div>
      <h2 style={{ marginLeft: 8, marginTop: 12 }}>Choose a Playlist</h2>
      {props.playlists
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => p.name && p.name.length > 0 && <Playlist key={p.id} playlist={p} generatePlaylist={props.generatePlaylist} />)}
    </div>
  );
}
