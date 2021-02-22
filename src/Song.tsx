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
const consistentMargin = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: -margin,
});

const cover = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const info = style({
  marginLeft: margin,
  wordBreak: 'break-word',
});

const coverInfo = style(
  {
    display: 'flex',
    marginTop: margin,
  },
  media(mobile, { width: '100%' })
);

const buttons = style(
  {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: margin,

    $nest: {
      'button, a': {
        marginLeft: 16,
      },
    },
  },
  media(mobile, {
    $nest: {
      'button, a': {
        marginLeft: 6,
      },
    },
  })
);

export function Song(props: {
  song: SpotifyApi.TrackObjectSimplified;
  generated: SpotifyApi.TrackObjectSimplified[];
  setGenerated: (generated: SpotifyApi.TrackObjectSimplified[]) => void;
}) {
  const [isHover, setIsHover] = useState(false);

  const { song } = props;

  return (
    <div className={s} key={song.id}>
      <div className={consistentMargin}>
        <div className={coverInfo}>
          <div
            className={`cover ${cover}`}
            style={{ backgroundImage: (song as any).album.images[2] ? `url(${(song as any).album.images[2].url})` : '' }}
          />

          <div className={info}>
            <div>{song.name}</div>
            <div style={{ fontSize: 13, filter: 'brightness(0.75)' }}>{song.artists[0].name}</div>
          </div>
        </div>

        <div className={buttons}>
          <button className="noButton" onClick={() => setIsHover(!isHover)}>
            {!song.preview_url || song.preview_url === null ? (
              <AlertTriangle className="iconButton" />
            ) : isHover ? (
              <>
                <PauseCircle className="iconButton" />
                <ReactAudioPlayer src={song.preview_url} autoPlay volume={0.75} />
              </>
            ) : (
              <PlayCircle className="iconButton" />
            )}
          </button>

          <a className="iconButton" href={song.external_urls.spotify} target="_blank" rel="noreferrer">
            <img src={icon} alt="Link to song on spotify" />
          </a>
          <button className="noButton" onClick={() => props.setGenerated(props.generated.filter((f) => f.id !== song.id))}>
            <XCircle className="iconButton" />
          </button>
        </div>
      </div>
    </div>
  );
}
