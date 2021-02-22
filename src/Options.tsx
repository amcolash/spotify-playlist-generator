import { X } from 'react-feather';
import { Range } from 'react-range';
import Switch from 'react-switch';

import { GenerateOptions } from './Generate';
import { Colors, mobile } from './util';

import icon from './img/icon.svg';
import { media, style } from 'typestyle';

const containerStyle = style(
  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 20 },
  media(mobile, { padding: 0 })
);

export function Options(props: { options: GenerateOptions; setOptions: (options: GenerateOptions) => void; generatePlaylist: () => void }) {
  return (
    <div className={containerStyle}>
      <X
        onClick={() => props.setOptions({ ...props.options, playlist: undefined })}
        style={{ position: 'absolute', top: 14, right: 14, cursor: 'pointer' }}
      />

      <h2 style={{ marginTop: 0 }}>Playlist Generation Options</h2>

      {props.options.playlist && <label>Source Playlist: {props.options.playlist.name}</label>}

      <label style={{ marginTop: 24, marginBottom: 12 }}>Playlist Size</label>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 10 }}>
        <label style={{ marginRight: 20 }}>Similar</label>
        <Range
          step={5}
          min={5}
          max={25}
          values={[props.options.resultsPerGroup]}
          onChange={(values) => props.setOptions({ ...props.options, resultsPerGroup: values[0] })}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 5,
                width: '100%',
                backgroundColor: Colors.White,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 24,
                width: 24,
                borderRadius: '100%',
                border: `1px solid ${Colors.White}`,
                backgroundColor: Colors.Green,
              }}
            />
          )}
        />
        <label style={{ marginLeft: 20 }}>Larger</label>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span
          style={{ marginRight: 10, fontWeight: props.options.shuffle ? undefined : 'bold' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, shuffle: false });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Ordered
        </span>
        <Switch
          onChange={(checked) => props.setOptions({ ...props.options, shuffle: checked })}
          checked={props.options.shuffle}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor={Colors.Green}
          offColor={Colors.Green}
        />
        <span
          style={{ marginLeft: 10, fontWeight: props.options.shuffle ? 'bold' : undefined, textAlign: 'right' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, shuffle: true });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Shuffled
        </span>
      </label>

      <label style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span
          style={{ marginRight: 10, fontWeight: props.options.trackSeed ? 'bold' : undefined }}
          onClick={(e) => {
            props.setOptions({ ...props.options, trackSeed: true });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Playlist Tracks
        </span>
        <Switch
          onChange={(checked, e) => props.setOptions({ ...props.options, trackSeed: !checked })}
          checked={!props.options.trackSeed}
          checkedIcon={false}
          uncheckedIcon={false}
          onColor={Colors.Green}
          offColor={Colors.Green}
        />
        <span
          style={{ marginLeft: 10, fontWeight: props.options.trackSeed ? undefined : 'bold', textAlign: 'right' }}
          onClick={(e) => {
            props.setOptions({ ...props.options, trackSeed: false });
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          Playlist Artists
        </span>
      </label>

      <button style={{ marginTop: 26, display: 'flex', alignItems: 'center' }} onClick={props.generatePlaylist}>
        <img src={icon} style={{ width: 32, filter: 'grayscale(1) brightness(2)', marginRight: 6 }} alt="" />
        DiscoList
      </button>
    </div>
  );
}
