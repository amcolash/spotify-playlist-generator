import { useEffect } from 'react';
import { LogIn } from 'react-feather';
import { Loading } from './Loading';

import { getHashParams, setSpotifyToken } from './util';

import icon from './img/icon.svg';

function login(setAuthenticated: (authenticated: boolean) => void) {
  const params = getHashParams();

  if (!params.access_token || params.state !== localStorage.getItem('spotifyState')) {
    const scopes = ['playlist-read-private', 'playlist-modify-public'],
      redirectUri =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://amcolash.github.io/spotify-playlist-generator/',
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
}

export function Login(props: { setAuthenticated: (authenticated: boolean) => void }) {
  const firstAuth = !localStorage.getItem('spotifyState');

  useEffect(() => {
    if (!firstAuth) login(props.setAuthenticated);
  }, [props, firstAuth]);

  if (!firstAuth) return <Loading text="Logging In" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ margin: 0, fontSize: 72 }}>[DiscoList]</h1>
      <h3 style={{ marginTop: 4 }}>Smart Music Discovery</h3>
      <img src={icon} style={{ height: 156, margin: 16, marginBottom: 80 }} />
      <h2>
        Please Sign In
        <br /> to Spotify
      </h2>
      <button onClick={() => login(props.setAuthenticated)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LogIn style={{ marginRight: 10 }} />
          Sign In
        </div>
      </button>
    </div>
  );
}
