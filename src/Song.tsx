import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { AlertOctagon, Volume2, XCircle } from 'react-feather';
import { classes, style } from 'typestyle';

import { Colors } from './util';

import icon from './img/Spotify_Icon_RGB_Green.png';

const s = style({
  display: 'flex',
  padding: 8,
  margin: '10px 0px',
  transition: 'background 0.25s',

  $nest: {
    '&.hover': {
      background: Colors.Grey,
    },
  },
});

const info = style({
  display: 'flex',
  alignItems: 'flex-start',
  marginLeft: 10,
  width: '100%',
});

const cover = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export function Song(props: {
  song: SpotifyApi.TrackObjectSimplified;
  generated: SpotifyApi.TrackObjectSimplified[];
  setGenerated: (generated: SpotifyApi.TrackObjectSimplified[]) => void;
  audioPreview: boolean;
}) {
  const { song } = props;

  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={classes(s, isHover ? 'hover' : '')}
      key={song.id}
      onMouseEnter={() => {
        if (window.innerWidth < 450) return;
        setIsHover(true);
      }}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => setIsHover(!isHover)}
      onFocus={() => setIsHover(true)}
      onBlur={(e) => {
        if ((e.relatedTarget && (e.relatedTarget as HTMLElement).parentElement?.getAttribute('data-id') !== song.id) || !e.relatedTarget)
          setIsHover(false);
      }}
    >
      <div
        className={`cover ${cover}`}
        style={{ backgroundImage: (song as any).album.images[2] ? `url(${(song as any).album.images[2].url})` : '' }}
      >
        {isHover && song.preview_url && song.preview_url !== null && props.audioPreview && (
          <>
            <Volume2 width={28} height={28} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '100%', padding: 8 }} />
            <ReactAudioPlayer src={song.preview_url} autoPlay />
          </>
        )}
        {isHover && (!song.preview_url || song.preview_url === null) && props.audioPreview && (
          <AlertOctagon width={28} height={28} style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '100%', padding: 8 }} />
        )}
      </div>
      <div className={info} data-id={song.id}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {song.name} - {song.artists[0].name}
        </div>
        <div style={{ flex: 1 }} />

        <a className="iconButton" href={song.external_urls.spotify} target="_blank" rel="noreferrer" style={{ margin: '0 18px' }}>
          <img src={icon} style={{ height: 24, width: 24 }} alt="Link to song on spotify" />
        </a>
        <button className="noButton" onClick={() => props.setGenerated(props.generated.filter((f) => f.id !== song.id))}>
          <XCircle className="iconButton" />
        </button>
      </div>
    </div>
  );
}
