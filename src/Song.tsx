import { style } from 'typestyle';

const s = style({
  display: 'flex',
  alignItems: 'center',
  margin: 8,

  $nest: {
    '.cover': {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: 50,
      width: 50,
      border: '1px solid #555',
    },
  },
});

export function Song(props: { song: SpotifyApi.TrackObjectSimplified }) {
  const { song } = props;

  return (
    <div className={s} key={song.id}>
      <div
        className="cover"
        style={{ backgroundImage: (song as any).album.images[2] ? `url(${(song as any).album.images[2].url})` : '' }}
      />
      <div style={{ marginLeft: 10 }}>
        {song.name} - {song.artists[0].name}
      </div>
    </div>
  );
}
