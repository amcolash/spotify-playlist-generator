import { useEffect, useState } from 'react';

import { Generate } from './Generate';
import { getHashParams, setSpotifyToken } from './util';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const params = getHashParams();

    if (authenticated) return;

    if (!params.access_token || params.state !== localStorage.getItem('spotifyState')) {
      const scopes = ['playlist-read-private', 'playlist-modify-public'],
        redirectUri = 'http://localhost:3000',
        clientId = 'c2fc1a6c5ec54aa2819513c41fc6d12f',
        state = Math.random().toString(),
        showDialog = !localStorage.getItem('spotifyState');

      localStorage.setItem('spotifyState', state);

      // Do client-based auth flow
      const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&show_dialog=${showDialog}`;
      window.location.href = authorizeURL;
    } else {
      setAuthenticated(true);
      setSpotifyToken(params.access_token);

      window.location.hash = '';
    }
  }, [authenticated]);

  return <div className="App">{authenticated && <Generate />}</div>;
}

export default App;
