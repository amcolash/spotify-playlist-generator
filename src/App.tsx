import { useState } from 'react';
import { LogOut } from 'react-feather';
import { cssRule, style } from 'typestyle';

import { Generate } from './Generate';
import { Login } from './Login';

import spotifyLogo from './img/Spotify_Logo_RGB_Green.png';

const appStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  overflowX: 'hidden',
});

cssRule('.cover', {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: 50,
  width: 50,
  border: '1px solid #555',
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem('spotifyState');
    setAuthenticated(false);
  };

  return (
    <div className={`App ${appStyle}`}>
      {!authenticated && <Login setAuthenticated={setAuthenticated} />}
      {authenticated && <Generate />}

      {authenticated && (
        <div style={{ position: 'absolute', top: 20, right: 30 }}>
          <button onClick={() => logout()}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LogOut style={{ marginRight: 10 }} />
              Sign Out
            </div>
          </button>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, right: authenticated ? 30 : 20, textAlign: 'right' }}>
        <h3 style={{ marginBottom: 10 }}>Powered By</h3>
        <a href="https://spotify.com" target="_blank" rel="noreferrer">
          <img src={spotifyLogo} style={{ height: 35 }} alt="Spotify Logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
