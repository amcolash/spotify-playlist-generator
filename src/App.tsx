import { useEffect, useState } from 'react';
import { cssRule, style } from 'typestyle';

import { Generate } from './Generate';
import { Login } from './Login';
import { spotify } from './util';

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
  const [user, setUser] = useState<SpotifyApi.CurrentUsersProfileResponse>();

  useEffect(() => {
    if (authenticated) spotify.getMe().then((data) => setUser(data.body));
  }, [authenticated]);

  const logout = () => {
    localStorage.removeItem('spotifyState');
    setAuthenticated(false);
    setUser(undefined);
  };

  return (
    <div className={`App ${appStyle}`}>
      {!authenticated && <Login setAuthenticated={setAuthenticated} />}
      {authenticated && <Generate />}

      {user && (
        <div style={{ position: 'absolute', top: 20, right: authenticated ? 30 : 20 }}>
          {user.display_name}
          <button style={{ marginLeft: 20 }} onClick={() => logout()}>
            Logout
          </button>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, right: authenticated ? 30 : 20, textAlign: 'right' }}>
        <h3 style={{ marginBottom: 10 }}>Powered By</h3>
        <img src={spotifyLogo} style={{ height: 35 }} alt="Spotify Logo" />
      </div>
    </div>
  );
}

export default App;
