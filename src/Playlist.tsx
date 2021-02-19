import { style } from 'typestyle';
import { GenerateOptions } from './Generate';

const s = style({
  $nest: {
    '.box': {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',

      cursor: 'pointer',
      transition: 'background 0.25s',

      $nest: {
        '&:hover': {
          background: '#333',
        },
      },
    },
  },
});

export function Playlist(props: {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  options: GenerateOptions;
  setOptions: (options: GenerateOptions) => void;
}) {
  const { playlist } = props;

  return (
    <div className={s} key={playlist.id}>
      <div
        className="box"
        onClick={() => props.setOptions({ ...props.options, playlist: playlist })}
        style={{ background: props.options.playlist && props.options.playlist.id === playlist.id ? '#333' : undefined }}
      >
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
