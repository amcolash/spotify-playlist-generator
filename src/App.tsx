import { useState } from 'react';
import { style } from 'typestyle';

import { Generate } from './Generate';
import { Login } from './Login';

import spotify from './img/Spotify_Logo_RGB_Green.png';

const appStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  overflowX: 'hidden',
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div className={`App ${appStyle}`}>
      {!authenticated && <Login setAuthenticated={setAuthenticated} />}
      {authenticated && <Generate />}

      <div style={{ position: 'absolute', bottom: 10, right: authenticated ? 30 : 20, textAlign: 'right' }}>
        <h3 style={{ marginBottom: 10 }}>Powered By</h3>
        <img src={spotify} style={{ height: 35 }} alt="Spotify Logo" />
      </div>
    </div>
  );
}

export default App;
