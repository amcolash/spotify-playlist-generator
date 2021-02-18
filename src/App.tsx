import { useEffect, useState } from 'react';

import { Playlists } from './Playlists';

// Useful code from https://stackoverflow.com/questions/58964265/spotify-implicit-grant-flow-with-react-user-login
function getHashParams(): { [key: string]: string } {
  const hashParams: { [key: string]: string } = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  let e = r.exec(q);
  while (e) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
    e = r.exec(q);
  }
  return hashParams;
}

function App() {
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const params = getHashParams();

    if (accessToken) return;

    if (!params.access_token || params.state !== localStorage.getItem('spotifyState')) {
      const scopes = ['playlist-read-private'],
        redirectUri = 'http://localhost:3000',
        clientId = 'c2fc1a6c5ec54aa2819513c41fc6d12f',
        state = Math.random().toString(),
        showDialog = !localStorage.getItem('spotifyState');

      localStorage.setItem('spotifyState', state);

      // Do client-based auth flow
      const authorizeURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}&show_dialog=${showDialog}`;
      window.location.href = authorizeURL;
    } else {
      setAccessToken(params.access_token);
      // window.location.hash = '';
    }
  }, [accessToken]);

  return <div className="App">{accessToken && <Playlists accessToken={accessToken} />}</div>;
}

export default App;
