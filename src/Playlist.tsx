import { style } from 'typestyle';

import { GenerateOptions } from './Generate';
import { Colors } from './util';

import icon from './img/Spotify_Icon_RGB_Green.png';

const s = style({
  $nest: {
    '.box': {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '8px 12px',

      cursor: 'pointer',
      transition: 'background 0.25s',

      '-webkit-tap-highlight-color': 'transparent',

      $nest: {
        '&:hover': {
          background: Colors.Grey,
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
    <div
      className={s}
      key={playlist.id}
      tabIndex={0}
      onClick={() => props.setOptions({ ...props.options, playlist: playlist })}
      onKeyDown={(e) => {
        if (e.key === 'Enter') props.setOptions({ ...props.options, playlist: playlist });
      }}
    >
      <div
        className="box"
        style={{ background: props.options.playlist && props.options.playlist.id === playlist.id ? Colors.Grey : undefined }}
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

        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>{playlist.name}</div>
          <div style={{ flex: 1 }} />
          <a className="iconButton" href={playlist.external_urls.spotify} target="_blank" rel="noreferrer" style={{ margin: '0 0 0 18px' }}>
            <img src={icon} style={{ height: 24, width: 24 }} alt="Link to song on spotify" />
          </a>
        </div>
      </div>
    </div>
  );
}
