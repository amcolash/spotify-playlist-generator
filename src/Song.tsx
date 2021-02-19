import { style } from 'typestyle';

const s = style({
  display: 'flex',
  padding: 8,
});

const info = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 10,
});

export function Song(props: { song: SpotifyApi.TrackObjectSimplified }) {
  const { song } = props;

  return (
    <div className={s} key={song.id}>
      <div
        className="cover"
        style={{ backgroundImage: (song as any).album.images[2] ? `url(${(song as any).album.images[2].url})` : '' }}
      />
      <div className={info}>
        {song.name} - {song.artists[0].name}
      </div>
    </div>
  );
}
