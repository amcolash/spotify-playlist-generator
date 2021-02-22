import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { AlertTriangle, PauseCircle, PlayCircle, XCircle } from 'react-feather';
import { media, style } from 'typestyle';

import { mobile } from './util';

import icon from './img/Spotify_Icon_RGB_Green.png';

const s = style({
  padding: 8,
  margin: '10px 0px',
});

const margin = 10;
const consistentMargin = style(
  {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: -margin,
  },
  media(mobile, {
    flexWrap: 'wrap',
  })
);

const cover = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: margin,
});

const info = style({
  marginTop: margin,
  marginLeft: margin,
});

const buttons = style({
  display: 'flex',
  alignItems: 'center',
  marginTop: margin,
});

export function Song(props: {
  song: SpotifyApi.TrackObjectSimplified;
  generated: SpotifyApi.TrackObjectSimplified[];
  setGenerated: (generated: SpotifyApi.TrackObjectSimplified[]) => void;
}) {
  const [isHover, setIsHover] = useState(false);

  const { song } = props;
  const playSize = 22;

  return (
    <div className={s} key={song.id}>
      <div className={consistentMargin}>
        <div style={{ display: 'flex' }}>
          <div
            className={`cover ${cover}`}
            style={{ backgroundImage: (song as any).album.images[2] ? `url(${(song as any).album.images[2].url})` : '' }}
          />

          <div className={info}>
            {song.name} - {song.artists[0].name}
          </div>
        </div>

        <div className={buttons}>
          <button className="noButton" onClick={() => setIsHover(!isHover)}>
            {!song.preview_url || song.preview_url === null ? (
              <AlertTriangle className="iconButton" width={playSize} height={playSize} />
            ) : isHover ? (
              <>
                <PauseCircle className="iconButton" width={playSize} height={playSize} />
                <ReactAudioPlayer src={song.preview_url} autoPlay volume={0.85} />
              </>
            ) : (
              <PlayCircle className="iconButton" width={playSize} height={playSize} />
            )}
          </button>

          <a className="iconButton" href={song.external_urls.spotify} target="_blank" rel="noreferrer" style={{ margin: '0 18px' }}>
            <img src={icon} style={{ height: 24, width: 24 }} alt="Link to song on spotify" />
          </a>
          <button className="noButton" onClick={() => props.setGenerated(props.generated.filter((f) => f.id !== song.id))}>
            <XCircle className="iconButton" />
          </button>
        </div>
      </div>
    </div>
  );
}
