import { style } from 'typestyle';

const s = style({
  $nest: {
    '.cover': {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: 50,
      width: 50,
      border: '1px solid #555',
    },

    '.box': {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',

      cursor: 'pointer',
      transition: 'all 0.25s',

      $nest: {
        '&:hover': {
          background: '#333',
        },
      },
    },
  },
});

export function Playlist(props: { playlist: SpotifyApi.PlaylistObjectSimplified; generatePlaylist: (id: string) => void }) {
  const { playlist } = props;

  return (
    <div className={s} key={playlist.id}>
      <div className="box" onClick={() => props.generatePlaylist(playlist.id)}>
        <div
          className="cover"
          style={{
            backgroundImage: playlist.images[2]
              ? `url(${playlist.images[2].url})`
              : playlist.images[0]
              ? `url(${playlist.images[0].url})`
              : '',
          }}
        />
        <div style={{ marginLeft: 10 }}>{playlist.name}</div>
      </div>
    </div>
  );
}
